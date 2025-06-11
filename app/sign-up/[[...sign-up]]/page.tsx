import { SignUp } from "@clerk/nextjs";
import { requireGuest } from "@/lib/auth";

export default async function SignUpPage() {
  // Redirect to chat if already signed in
  await requireGuest();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "bg-card border border-border shadow-lg",
          },
        }}
      />
    </div>
  );
}
