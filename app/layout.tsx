import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { ThemeProvider } from "./provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://binit-nayak.netlify.app"),
  title: {
    default: "Binit Nayak | Software Developer",
    template: "%s | Binit Nayak",
  },
  description:
    "Portfolio of Binit Nayak, a software developer in India building polished full-stack web applications with React, Next.js, TypeScript, and modern frontend tooling.",
  authors: [{ name: "Binit Nayak" }],
  creator: "Binit Nayak",
  keywords: [
    "Binit Nayak",
    "Software Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Portfolio",
  ],
  openGraph: {
    title: "Binit Nayak | Software Developer",
    description:
      "Explore Binit Nayak's software projects, experience, tech stack, and contact links.",
    url: "https://binit-nayak.netlify.app",
    siteName: "Binit Nayak Portfolio",
    images: [
      {
        url: "/assests/myPhoto.jpg",
        width: 1200,
        height: 630,
        alt: "Binit Nayak",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Binit Nayak | Software Developer",
    description:
      "Software developer portfolio featuring projects, experience, and contact links.",
    images: ["/assests/myPhoto.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assests/favIcon.svg" sizes="any" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
