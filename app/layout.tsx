import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nafiz Arnob — Portfolio OS",
  description: "Product Consultant & Developer — AML/KYC, Next.js, TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
