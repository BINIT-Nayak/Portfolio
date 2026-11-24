import { PortfolioTourProvider } from "@/components/tour/PortfolioTour";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import { identitySchema } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import { RouteTransitions } from "@/components/ui/RouteTransitions/RouteTransitions";
import { FloatingNav } from "@/components/ui/FloatingNavbar/FloatingNavbar";
import { ViewportMotion } from "@/components/ui/Motion/ViewportMotion";
import { PointerEffects } from "@/components/ui/PointerEffects/PointerEffects";
import { navItems } from "@/data";
import { ThemeProvider } from "./provider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Binit Nayak | Frontend & Full Stack Engineer", template: "%s | Binit Nayak" },
  description:
    "Binit Nayak is a Frontend and Full Stack Engineer in Hyderabad, building React and TypeScript interfaces with Java and Spring Boot services.",
  authors: [{ name: "Binit Nayak", url: SITE_URL }],
  creator: "Binit Nayak",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <JsonLd data={identitySchema} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <PortfolioTourProvider>
            <PointerEffects />
            <ViewportMotion />
            <FloatingNav navItems={navItems} />
            <RouteTransitions>{children}</RouteTransitions>
          </PortfolioTourProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
