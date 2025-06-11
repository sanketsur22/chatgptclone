// API route to test Clerk authentication
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required", authenticated: false },
        { status: 401 }
      );
    }

    // Get user details from Clerk
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "User not found", authenticated: false },
        { status: 404 }
      );
    }

    // Return user information
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        imageUrl: user.imageUrl,
      },
    });
  } catch (error: any) {
    console.error("Auth test error:", error);
    return NextResponse.json(
      { error: "Authentication test failed", message: error.message },
      { status: 500 }
    );
  }
}
