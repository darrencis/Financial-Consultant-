import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggestions | Ekash Finance",
  description: "AI-powered suggestions for what to do with your money",
};

export default function SuggestionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
