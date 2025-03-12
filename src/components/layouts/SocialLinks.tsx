"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, LucideIcon, Mail } from "lucide-react";
import Link from "next/link";

interface SocialLink {
  name: string;
  icon: LucideIcon;
  href: string;
  isEmail: boolean;
  color: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/sebastian.mosqueravalencia",
    isEmail: false,
    color: "#1877F2", // Azul de Facebook
  },
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/sebasmv95",
    isEmail: false,
    color: "#E4405F", // Rosa de Instagram
  },
  {
    name: "Linkedin",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/semosva/",
    isEmail: false,
    color: "#0077B5", // Azul de LinkedIn
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:sebas19957@hotmail.com",
    isEmail: true,
    color: "#D44638", // Rojo de Gmail
  },
];

export function SocialLinks() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 hidden flex-col gap-4 2xl:flex z-50"
    >
      {socialLinks.map((link) => {
        const Icon = link.icon;

        return link.isEmail ? (
          <a
            key={link.name}
            href={link.href}
            className="text-muted-foreground hover:text-primary hover:translate-x-2 transition-transform duration-300 cursor-pointer"
          >
            <Icon size={30} style={{ color: link.color }} />
            <span className="sr-only">{link.name}</span>
          </a>
        ) : (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            className="text-muted-foreground hover:text-primary hover:translate-x-2 transition-transform duration-300 cursor-pointer"
          >
            <Icon size={30} style={{ color: link.color }} />
            <span className="sr-only">{link.name}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}
