import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import type React from "react"; // Import React

import { LanguageProvider } from "@/contexts/LanguageContext";
import Cursor from "@/components/shared/Cursor";

const inter = Inter({ subsets: ["latin"] });

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Mi Portafolio - Desarrollador Web",
  description:
    "Portafolio de un desarrollador web con experiencia en Next.js, React y más.",
  openGraph: {
    title: "Mi Portafolio - Desarrollador Web",
    description: "Explora mi portafolio y descubre mis proyectos.",
    url: "https://www.sebastianmv.com",
    siteName: "Mi Portafolio",
    images: [
      {
        url: "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/sebastianmv_portfolio.png",
        width: 1200,
        height: 630,
        alt: "Vista previa de mi portafolio",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mi Portafolio - Desarrollador Web",
    description: "Explora mi portafolio y descubre mis proyectos.",
    images: [
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/sebastianmv_portfolio.png",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} ${barlowCondensed.variable} bg-background text-foreground`}>
        <LanguageProvider>
          <main className="p-4 sm:p-0">{children}</main>
          <div className="hidden md:block">
            <Cursor />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
