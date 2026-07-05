import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nafizarnob.github.io"),
  title: "Nafiz Arnob — Portfolio OS",
  description:
    "Product Consultant at Fenergo — AML/KYC & CLM for Australia's largest banks. Builder of AI-powered delivery tools adopted org-wide.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Nafiz Arnob — Portfolio OS",
    description:
      "Product Consultant at Fenergo — AML/KYC & CLM for Australia's largest banks. Builder of AI-powered delivery tools adopted org-wide.",
    url: "https://nafizarnob.github.io",
    siteName: "Nafiz Arnob",
    images: [{ url: "/linkedin-thumbnail.png", width: 1200, height: 628 }],
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nafiz Arnob — Portfolio OS",
    description:
      "Product Consultant at Fenergo — AML/KYC & CLM for Australia's largest banks.",
    images: ["/linkedin-thumbnail.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden antialiased">{children}</body>
    </html>
  );
}
