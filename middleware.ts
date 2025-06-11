import { clerkMiddleware } from "@clerk/nextjs/server";

// Use Clerk middleware without additional configuration
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
