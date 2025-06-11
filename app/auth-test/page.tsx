"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AuthTestPage() {
  const { userId, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Test API authentication
  const testApiAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth-test");
      const data = await response.json();

      setApiResponse(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("API auth test failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Client-Side Auth Status</h2>
        <div className="space-y-2">
          <p>
            <strong>Auth Loaded:</strong> {authLoaded ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Signed In:</strong> {isSignedIn ? "Yes" : "No"}
          </p>
          <p>
            <strong>User ID:</strong> {userId || "Not authenticated"}
          </p>
          <p>
            <strong>User Loaded:</strong> {userLoaded ? "Yes" : "No"}
          </p>
          {user && (
            <div className="mt-4">
              <p>
                <strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}
              </p>
              <p>
                <strong>Name:</strong> {user.fullName || user.username}
              </p>
              {user.imageUrl && (
                <div className="mt-2">
                  <p>
                    <strong>Profile Image:</strong>
                  </p>
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Authentication Test</h2>
        <Button onClick={testApiAuth} disabled={isLoading} className="mb-4">
          {isLoading ? "Testing..." : "Test API Authentication"}
        </Button>

        {error && (
          <div className="p-4 mb-4 bg-red-50 text-red-800 rounded">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {apiResponse && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </Card>
    </div>
  );
}
