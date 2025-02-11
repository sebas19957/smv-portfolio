"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import RotatingText from "./RotatingText";
import ParallaxImage from "./layouts/ParallaxImage";

export function Home() {
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.slice(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="min-h-screen pt-16 relative overflow-hidden">
      <div className="container mx-auto flex flex-col lg:flex-row items-center min-h-screen px-4 sm:px-6 lg:px-8">
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
              Hola, Soy
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: false }}
              className="text-5xl sm:text-5xl lg:text-6xl 2xl:text-8xl font-bold mb-4 text-gradient"
            >
              Sebastián Mosquera Valencia
            </motion.h1>

            <RotatingText className="justify-center lg:justify-start items-center" />
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
                  onClick={(e) => handleClick(e, "#contact")}
                >
                  Contáctame
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="#about" onClick={(e) => handleClick(e, "#about")}>
                  Sobre Mí
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: false }}
            className="relative hidden lg:block group"
          >
            <ParallaxImage />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: false }}
          className="lg:hidden mt-10 p-4"
        >
          <Image
            src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/myself_img_3.jpg"
            alt="Parallax Demo Image"
            width={400}
            height={500}
            className="h-auto rounded-2xl "
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
