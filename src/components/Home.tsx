"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, LucideIcon, Mail } from "lucide-react";

import RotatingText from "./RotatingText";
import ParallaxRotateImg from "./layouts/ParallaxRotateImg";
import MouseAnimation from "./layouts/MouseAnimation";

interface SocialLink {
  name: string;
  icon: LucideIcon;
  href: string;
  isEmail: boolean;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/sebastian.mosqueravalencia",
    isEmail: false,
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/sebasmv95",
    isEmail: false,
  },
  {
    name: "Linkedin",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/semosva/",
    isEmail: false,
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:sebas19957@hotmail.com",
    isEmail: true,
  },
];

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
              Hola, Soy
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: false }}
              className="text-6xl lg:text-6xl 2xl:text-7xl font-bold mb-4 text-gradient"
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center lg:justify-start gap-4 mt-8"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return link.isEmail ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon />
                    <span className="sr-only">{link.name}</span>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon />
                    <span className="sr-only">{link.name}</span>
                  </Link>
                );
              })}
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
          >
            <ParallaxRotateImg />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
