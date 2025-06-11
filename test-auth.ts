// Test file for authentication flow
import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

// Mock function to test auth flow
export async function testAuthentication() {
  try {
    // Test getting current user from Clerk
    const user = await currentUser();

    if (!user) {
      console.log("No user authenticated");
      return { success: false, message: "No user authenticated" };
    }

    // Get auth session
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      console.log("No userId in session");
      return { success: false, message: "No userId in session" };
    }

    // Verify userId matches
    if (userId !== user.id) {
      console.log("User ID mismatch between session and current user");
      return {
        success: false,
        message: "User ID mismatch",
        sessionId: userId,
        userId: user.id,
      };
    }

    return {
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,
      },
    };
  } catch (error) {
    console.error("Authentication test error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: "Authentication test error",
      error: errorMessage,
    };
  }
}
