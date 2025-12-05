"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Globe, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useLanguage } from "@/contexts/LanguageContext";
import { Logo } from "./Logo";

export function Nav() {
  const [activeSection, setActiveSection] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Memorizar el array de enlaces para evitar recreaciones en cada renderizado
  const links = useMemo(
    () => [
      { key: "nav.home", href: "#home" },
      { key: "nav.about", href: "#about" },
      { key: "nav.skills", href: "#skills" },
      { key: "nav.resume", href: "#resume" },
      { key: "nav.projects", href: "#projects" },
      { key: "nav.testimonials", href: "#testimonials" },
      { key: "nav.contact", href: "#contact" },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = links.map((link) => link.href.slice(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [links]); // Ahora links es estable entre renderizados

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
    setIsOpen(false);
  };

  const changeLanguage = (lang: "es" | "en") => {
    setLanguage(lang);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-background/80 backdrop-blur-xs">
      <div className="flex h-16 items-center justify-between px-2 sm:px-6 lg:px-8">
        {/* Sección 1: Logo (izquierda) */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex gap-2 lg:hidden">
          <Button
            className={`px-2 ${
              language === "en"
                ? "text-primary font-medium bg-primary/30"
                : "text-muted-foreground"
            }`}
            variant={language === "en" ? "outline" : "ghost"}
            size="icon"
            onClick={() => changeLanguage("en")}
          >
            <Image
              src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/en.svg"
              alt="English"
              width={28}
              height={28}
            />
          </Button>
          <Button
            className={`px-2 ${
              language === "es"
                ? "text-primary font-medium bg-primary/30"
                : "text-muted-foreground"
            }`}
            variant={language === "es" ? "outline" : "ghost"}
            size="icon"
            onClick={() => changeLanguage("es")}
          >
            <Image
              src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/es.svg"
              alt="Spanish"
              width={28}
              height={28}
            />
          </Button>
        </div>

        {/* Sección 2: Menú de navegación (centro) - solo visible en desktop */}
        <div className="hidden lg:block mx-auto">
          <ul className="flex items-center gap-8">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="relative text-sm font-medium transition-colors hover:text-primary"
                  onClick={(e) => handleClick(e, link.href)}
                >
                  {t(link.key)}
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      layoutId="underline"
                      className="absolute left-0 top-full block h-px w-full bg-primary"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sección 3: Selector de idioma (derecha) - solo visible en desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />

          <Button
            variant={language === "en" ? "outline" : "ghost"}
            size="sm"
            className={`px-2 ${
              language === "en"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
            onClick={() => changeLanguage("en")}
          >
            EN
            <Image
              src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/en.svg"
              alt="English"
              width={16}
              height={16}
            />
          </Button>
          <span className="text-muted-foreground">|</span>
          <Button
            variant={language === "es" ? "outline" : "ghost"}
            size="sm"
            className={`px-2 ${
              language === "es"
                ? "text-primary font-medium"
                : "text-muted-foreground"
            }`}
            onClick={() => changeLanguage("es")}
          >
            ES
            <Image
              src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/es.svg"
              alt="Spanish"
              width={16}
              height={16}
            />
          </Button>
        </div>

        {/* Menú móvil */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="mr-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4">
              <div className="sr-only">
                <SheetTitle>Menú de navegación</SheetTitle>
              </div>

              {links.map((link) => {
                const isActive = activeSection === link.href.slice(1);
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary relative ${
                      isActive ? "text-primary underline" : "text-foreground"
                    }`}
                    onClick={(e) => {
                      handleClick(e, link.href);
                      const sheet = document.querySelector(
                        '[data-state="open"]'
                      );
                      if (sheet) {
                        const closeButton = sheet.querySelector(
                          'button[aria-label="Close"]'
                        );
                        if (closeButton instanceof HTMLElement) {
                          closeButton.click();
                        }
                      }
                    }}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}

              {/* Selector de idioma para móvil */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div className="flex gap-4">
                    <Button
                      variant={language === "en" ? "outline" : "ghost"}
                      size="sm"
                      className={
                        language === "en"
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }
                      onClick={() => changeLanguage("en")}
                    >
                      English
                      <Image
                        src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/en.svg"
                        alt="English"
                        width={16}
                        height={16}
                      />
                    </Button>
                    <span className="border-b border-1 border-muted-foreground " />
                    <Button
                      variant={language === "es" ? "outline" : "ghost"}
                      size="sm"
                      className={
                        language === "es"
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }
                      onClick={() => changeLanguage("es")}
                    >
                      Español
                      <Image
                        src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/svgs/es.svg"
                        alt="Spanish"
                        width={16}
                        height={16}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
