import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blueforge — Defensive Cyber Lab",
  description: "Safe, practical Python and Linux training for future defenders.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
