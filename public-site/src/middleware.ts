import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/coming-soon'];
const PUBLIC_FILE_PATHS = ['/favicon.ico', '/robots.txt', '/sitemap.xml', '/manifest.json'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.VERCEL_ENV === 'production';

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
  const isPublicFile = PUBLIC_FILE_PATHS.includes(pathname);
  const isAsset = pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.includes('.');

  // Keep production locked to the coming-soon page, but allow preview/local
  // environments to render the full site for ongoing page development.
  if (!isProduction || isPublicPath || isPublicFile || isAsset) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
