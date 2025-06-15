import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  authorizedParties: ['https://saas-app-lime.vercel.app'], 
});

export const config = {
  matcher: [
    /*
     * Protect all routes except Next.js internals and static files
     */
    "/((?!_next|static|favicon.ico|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};