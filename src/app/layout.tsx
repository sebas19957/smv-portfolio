import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type React from "react"; // Import React
import Cursor from "@/components/layouts/Cursor";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-background text-foreground`}>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
