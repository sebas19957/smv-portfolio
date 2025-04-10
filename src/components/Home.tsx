"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { smoothScroll } from "@/lib/helpers/smoothScroll";

import RotatingText from "./RotatingText";
import MouseAnimation from "./shared/MouseAnimation";
import { SocialLinks } from "./shared/SocialLinks";

export function Home() {
  const { tArray, t } = useLanguage();

  return (
    <section id="home" className="min-h-screen  pt-16 relative overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center md:min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false }}
            className="text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: false }}
              className="text-base sm:text-lg mb-4 block text-muted-foreground"
            >
              {t("home.title")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: false }}
              className="text-6xl lg:text-6xl 2xl:text-7xl font-bold mb-4 text-gradient"
            >
              {t("global.fullname")}
            </motion.h1>

            <RotatingText
              titles={tArray("global.profession")}
              className="justify-center lg:justify-start items-center"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: false }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link
                  href="#contact"
                  onClick={(e) => smoothScroll(e, "#contact")}
                >
                  {t("home.contact")}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="#about" onClick={(e) => smoothScroll(e, "#about")}>
                  {t("home.about")}
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SocialLinks />
            </motion.div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <MouseAnimation />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
            className="relative justify-items-center"
          >
            <Image
              src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me.png"
              alt="Descripción de la imagen"
              width={500}
              height={500}
              className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] object-cover shadow-lg mt-10 md:mt-0"
            />

            <div className="absolute -top-10 right-0 lg:top-1 md:right-28 lg:-right-10 xl:-right-5 2xl:right-10 border-4 border-primary/20 rounded-full">
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/myself/myself_1.jpg"
                alt="Descripción de la imagen"
                width={200}
                height={200}
                className="rounded-full w-[110px] h-[110px] lg:w-[150px] lg:h-[150px] object-cover "
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
