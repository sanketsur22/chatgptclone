// This is a mock authentication utility
// In a real application, you would integrate with NextAuth.js or a similar auth provider

import { getOrCreateUser } from "./db-utils";

// Mock user ID - this should be replaced with real authentication
export const MOCK_USER_ID = "mock-user-123";
export const MOCK_USER_EMAIL = "user@example.com";
export const MOCK_USER_NAME = "Demo User";

/**
 * Get the current user information (mock implementation)
 * @returns Mock user object
 */
export async function getCurrentUser() {
  // In a real app, this would check the session and return the authenticated user
  // For now, we'll create or get our mock user
  return getOrCreateUser(MOCK_USER_EMAIL, MOCK_USER_NAME);
}

/**
 * Check if a user is authenticated (mock implementation)
 * @returns Always true in this mock implementation
 */
export function isAuthenticated() {
  // In a real app, this would check if the user is authenticated
  return true;
}

/**
 * Get the current user ID (mock implementation)
 * @returns The mock user ID
 */
export function getCurrentUserId() {
  // In a real app, this would get the authenticated user's ID
  return MOCK_USER_ID;
}
