import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    /*
     * Protect all routes except Next.js internals and static files
     */
    "/((?!_next|static|favicon.ico|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};