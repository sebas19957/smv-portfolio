"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

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
  {
    name: "Linkedin",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/semosva/",
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
        return (
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
