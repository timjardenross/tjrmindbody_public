"use strict";(()=>{var e={};e.id=5932,e.ids=[5932],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},79429:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>f,patchFetch:()=>v,requestAsyncStorage:()=>h,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var s={};r.r(s),r.d(s,{GET:()=>d});var i=r(49303),n=r(88716),a=r(60670),o=r(87070),u=r(6005),p=r.n(u);let c="sveltia_cms_oauth_state";async function d(e){let t=process.env.GITHUB_OAUTH_CLIENT_ID,r=process.env.GITHUB_OAUTH_CLIENT_SECRET;if(!t||!r)return new o.NextResponse("Server is missing GITHUB_OAUTH_CLIENT_ID / GITHUB_OAUTH_CLIENT_SECRET.",{status:500});let{searchParams:s}=new URL(e.url),i=s.get("code");if(!i){let r=p().randomUUID(),s=new URL("/api/auth",e.url).toString(),i=new URL("https://github.com/login/oauth/authorize");i.searchParams.set("client_id",t),i.searchParams.set("scope","repo,read:user"),i.searchParams.set("state",r),i.searchParams.set("redirect_uri",s);let n=o.NextResponse.redirect(i.toString());return n.cookies.set(c,r,{httpOnly:!0,secure:!0,sameSite:"lax",maxAge:600,path:"/api/auth"}),n}let n=s.get("state"),a=e.cookies.get(c)?.value;if(!a||!n||!function(e,t){let r=Buffer.from(e),s=Buffer.from(t);return r.length===s.length&&p().timingSafeEqual(r,s)}(a,n))return new o.NextResponse("Invalid or expired OAuth state.",{status:400});let u=await fetch("https://github.com/login/oauth/access_token",{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify({client_id:t,client_secret:r,code:i,state:n})}),d=await u.json();if(!u.ok||d.error||!d.access_token)return new o.NextResponse(`GitHub OAuth error: ${d.error_description||d.error||"unknown error"}`,{status:400});let l=JSON.stringify({provider:"github",token:d.access_token}).replace(/</g,"\\u003c"),h=JSON.stringify(new URL(e.url).origin),g=`<!doctype html>
<html>
  <body>
    <script>
      (function () {
        var authPayload = ${l};
        var trustedOrigin = ${h};
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
</html>`,m=new o.NextResponse(g,{headers:{"Content-Type":"text/html; charset=utf-8"}});return m.cookies.delete(c),m}let l=new i.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/auth/route",pathname:"/api/auth",filename:"route",bundlePath:"app/api/auth/route"},resolvedPagePath:"/Volumes/SSK SSD/GitHub/tjrmindbody_public/public-site/src/app/api/auth/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:m}=l,f="/api/auth/route";function v(){return(0,a.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[8948,5972],()=>r(79429));module.exports=s})();