// Authentication utilities for Clerk
import { currentUser, auth } from "@clerk/nextjs/server";
import type { User } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Get the current Clerk user
 * @returns The current user or null if not authenticated
 */
export async function getUser(): Promise<User | null> {
  return await currentUser();
}

/**
 * Require authentication for a route
 * If user is not authenticated, redirect to sign-in page
 * @param redirectUrl Optional custom redirect URL
 */
export async function requireAuth(redirectUrl: string = "/sign-in") {
  const { userId } = await auth();

  if (!userId) {
    redirect(redirectUrl);
  }
  return userId;
}

/**
 * Require a guest (not authenticated) for a route
 * If user is authenticated, redirect to chat page
 * @param redirectUrl Optional custom redirect URL
 */
export async function requireGuest(redirectUrl: string = "/chat") {
  const { userId } = await auth();

  if (userId) {
    redirect(redirectUrl);
  }
}

/**
 * Check if a user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth();
  return Boolean(userId);
}
