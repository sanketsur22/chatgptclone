// Authentication utilities using Clerk for user management

import { getOrCreateUser } from "./db-utils";
import { currentUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";thentication utilities using Clerk for user management

import { getOrCreateUser } from "./db-utils";
import { auth, currentUser } from "@clerk/nextjs";
import { prisma } from "./prisma";

/**
 * Get the current user information from the database
 * @returns User object or null if not authenticated
 */
export async function getCurrentUser() {
  // Get the user from Clerk
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  // Get the primary email address
  const primaryEmail = user.emailAddresses.find(
    email => email.id === user.primaryEmailAddressId
  )?.emailAddress;
  
  if (!primaryEmail) {
    return null;
  }
  
  // Get the Clerk user ID
  const { userId } = auth();
  
  if (!userId) {
    return null;
  }
  
  // Get or create the user in our database
  return getOrCreateUser(
    primaryEmail,
    user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.username || "User"
  );
}

/**
 * Check if a user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export function isAuthenticated() {
  const { userId } = auth();
  return Boolean(userId);
}

/**
 * Get the current user ID
 * @returns The authenticated user's ID or null if not authenticated
 */
export function getCurrentUserId() {
  const { userId } = auth();
  return userId || null;
}
