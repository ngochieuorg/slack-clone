import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isPublicPage = createRouteMatcher(['/', '/auth']);

export default convexAuthNextjsMiddleware(
  async (request, { convexAuth }) => {
    // if (!isPublicPage(request) && !(await convexAuth.isAuthenticated())) {
    //   return nextjsMiddlewareRedirect(request, '/');
    // }
    if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, '/homepage');
    }
  },
  { cookieConfig: { maxAge: 60 * 60 * 24 * 30 } }
);

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
