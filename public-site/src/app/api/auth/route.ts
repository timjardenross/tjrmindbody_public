import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

/**
 * Self-hosted GitHub OAuth provider for the Sveltia CMS `/admin` editor.
 *
 * Replaces the OAuth broker Netlify used to provide for free (Identity /
 * Git Gateway). This single endpoint implements both legs of the flow —
 * see public-site/docs/CMS-SETUP.md for the GitHub OAuth App setup and the
 * exact postMessage handshake this mirrors (the same protocol used by
 * self-hosted Decap/Sveltia CMS OAuth providers).
 *
 * GitHub OAuth App "Authorization callback URL" must be:
 *   <NEXT_PUBLIC_SITE_URL>/api/auth
 */

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const STATE_COOKIE = 'sveltia_cms_oauth_state';

export async function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new NextResponse(
      'Server is missing GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET.',
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Leg 1: no `code` yet — send the browser to GitHub to authorize.
  if (!code) {
    const csrfState = crypto.randomUUID();
    const redirectUri = new URL('/api/auth', request.url).toString();

    const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
    authorizeUrl.searchParams.set('client_id', clientId);
    authorizeUrl.searchParams.set('scope', 'repo,user');
    authorizeUrl.searchParams.set('state', csrfState);
    authorizeUrl.searchParams.set('redirect_uri', redirectUri);

    const response = NextResponse.redirect(authorizeUrl.toString());
    response.cookies.set(STATE_COOKIE, csrfState, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600,
      path: '/api/auth',
    });
    return response;
  }

  // Leg 2: GitHub redirected back with a code — verify state, exchange it.
  const state = searchParams.get('state');
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (!expectedState || expectedState !== state) {
    return new NextResponse('Invalid or expired OAuth state.', { status: 400 });
  }

  const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, state }),
  });

  const tokenData: { access_token?: string; error?: string; error_description?: string } =
    await tokenResponse.json();

  if (!tokenResponse.ok || tokenData.error || !tokenData.access_token) {
    return new NextResponse(
      `GitHub OAuth error: ${tokenData.error_description || tokenData.error || 'unknown error'}`,
      { status: 400 }
    );
  }

  // Handshake payload embedded as a JSON object literal (not string-concatenated
  // into the script), then escaped so it can't break out of the <script> tag.
  const authPayloadJson = JSON.stringify({ provider: 'github', token: tokenData.access_token }).replace(
    /</g,
    '\\u003c'
  );

  // The token is only ever posted to this site's own origin — never to
  // event.origin from an incoming message, which an attacker-opened popup
  // could spoof to exfiltrate the token to a different origin entirely.
  const trustedOrigin = new URL(request.url).origin;
  const trustedOriginJson = JSON.stringify(trustedOrigin);

  const html = `<!doctype html>
<html>
  <body>
    <script>
      (function () {
        var authPayload = ${authPayloadJson};
        var trustedOrigin = ${trustedOriginJson};
        function receiveMessage(event) {
          if (event.origin !== trustedOrigin || event.data !== 'authorizing:github') return;
          window.removeEventListener('message', receiveMessage, false);
          window.opener.postMessage(
            'authorization:github:success:' + JSON.stringify(authPayload),
            trustedOrigin
          );
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', trustedOrigin);
      })();
    </script>
  </body>
</html>`;

  const response = new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  response.cookies.delete(STATE_COOKIE);
  return response;
}
