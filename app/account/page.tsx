import { UserProfile } from "@clerk/nextjs";

export default function AccountPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      <div className="w-full max-w-3xl">
        <UserProfile
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-border shadow-lg",
            },
          }}
        />
      </div>
    </div>
  );
}
