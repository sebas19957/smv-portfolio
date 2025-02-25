"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { ElementType } from "react";

interface SocialLink {
  name: string;
  icon: ElementType;
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
    isEmail: true, // Indicamos que es un email
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
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{link.name}</span>
          </a>
        ) : (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{link.name}</span>
          </Link>
        );
      })}
    </motion.div>
  );
}
