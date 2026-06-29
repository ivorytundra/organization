import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Digest",
  description:
    "Your calendar and important email for today, in one calm dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
