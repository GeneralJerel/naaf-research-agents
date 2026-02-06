import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Power Framework | Country Ranking Prototype",
  description:
    "Prototype dashboard for ranking countries by AI power readiness across five assessment pillars."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
