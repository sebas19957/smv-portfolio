"use client";
import { Facebook, Instagram, Github, Linkedin } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/sebastian.mosqueravalencia",
  },

  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/sebasmv95",
  },
  { name: "Github", icon: Github, href: "https://github.com/sebas19957" },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/semosva/",
  },
];

const links = [
  { name: "Inicio", href: "#home" },
  { name: "Sobre Mi", href: "#about" },
  { name: "Habilidades", href: "#skills" },
  { name: "Resumen", href: "#resume" },
  { name: "Proyectos", href: "#projects" },
  { name: "Testimonios", href: "#testimonials" },
  { name: "Contacto", href: "#contact" },
];

export function Footer() {
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
    <footer className="bg-card py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <Link href="/">
              <Logo />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Soy un desarrollador creativo que transforma ideas en experiencias
              digitales memorables.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => handleClick(e, link.href)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Sígueme</h3>
            <div className="flex gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="sr-only">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Portafolio. Todos los derechos
            resevados.
          </p>
        </div>
      </div>
    </footer>
  );
}
