import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings - ChatGPT Clone",
  description: "Manage your account settings",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
