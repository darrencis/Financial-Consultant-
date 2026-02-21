import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Ekash Finance",
  description: "Your profile and financial overview",
};

export default function ProfileLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
