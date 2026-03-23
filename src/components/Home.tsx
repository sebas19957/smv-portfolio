"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { smoothScroll } from "@/lib/helpers/smoothScroll";

import MouseAnimation from "./shared/MouseAnimation";
import { SocialLinks } from "./shared/SocialLinks";
import { MarqueeBand } from "./shared/MarqueeBand";

export function Home() {
  const { t } = useLanguage();

  return (
    <section id="home" className="h-screen relative overflow-hidden bg-background flex flex-col">
      {/* Nombre grande con efecto outline + Imagen */}
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 pt-16 md:pt-32 lg:pt-28">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-around">
          {/* Nombre */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative text-center lg:text-left"
          >
            {/* SEBASTIÁN - Outline amarillo */}
            <h1
              className="text-[5rem] sm:text-[5.5rem] md:text-[9rem] lg:text-[8rem] xl:text-[10rem] font-black leading-[0.8] tracking-tight"
              style={{
                WebkitTextStroke: "2px #facc15",
                WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              SEBASTIÁN
            </h1>
            {/* MOSQUERA - Sólido */}
            <h1
              className="text-[5rem] sm:text-[5.5rem] md:text-[9rem] lg:text-[8rem] xl:text-[10rem] font-black leading-[0.8] tracking-tight text-foreground lg:ml-[18%] -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10"
              style={{
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              MOSQUERA
            </h1>
            <h1
              className="text-[5rem] sm:text-[5.5rem] md:text-[9rem] lg:text-[8rem] xl:text-[10rem] font-black leading-[0.8] tracking-tight -mt-1 sm:-mt-2 md:-mt-4 text-[#facc15]"
              style={{
                // WebkitTextStroke: "2px #facc15",
                // WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              VALENCIA
            </h1>
          </motion.div>

          {/* Imagen con badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-[280px] xl:w-[320px] aspect-[3/4] overflow-hidden">
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/myself/myself_1.webp"
                alt="Sebastián Mosquera"
                fill
                className="object-cover grayscale"
                sizes="320px"
              />
              {/* Badge STATUS */}
              <div className="absolute top-4 left-4 bg-white px-3 py-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{t("home.badge.status")}</p>
                    <p className="text-xs text-gray-900 font-semibold">{t("home.badge.status.text")}</p>
                  </div>
                </div>
              </div>
              {/* Badge YEARS EXP */}
              <div className="absolute bottom-4 right-4 bg-yellow-400 px-4 py-3 shadow-lg">
                <p className="text-2xl font-black text-black">6+</p>
                <p className="text-[10px] text-black font-bold uppercase tracking-wider">{t("home.badge.years")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Banda marquee diagonal - amarilla con bordes blancos */}
      <div className="mt-auto mb-auto py-2">
        <MarqueeBand variant="yellow" />
      </div>

      {/* Contenido debajo de la banda */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-64 lg:pb-24">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
          {/* Columna izquierda - Descripción con borde e iconos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-md"
          >
            <div className="border-l-2 border-muted-foreground/30 pl-4">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {t("home.description")}
              </p>
            </div>
            <SocialLinks />
          </motion.div>

          {/* Columna derecha - Botones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <Button
              asChild
              size="lg"
              className="px-8 py-5 text-sm font-bold uppercase tracking-wider"
            >
              <Link href="#contact" onClick={(e) => smoothScroll(e, "#contact")}>
                {t("home.button.project")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="px-8 py-5 text-sm font-bold uppercase tracking-wider border-2 border-foreground"
            >
              <Link href="#resume" onClick={(e) => smoothScroll(e, "#resume")}>
                {t("home.button.resume")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mouse animation */}
      <div className="absolute bottom-8 left-8">
        <MouseAnimation />
      </div>
    </section>
  );
}
