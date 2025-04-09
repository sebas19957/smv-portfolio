"use client";

import { socialLinks } from "@/lib/data/socialLinks";
import Link from "next/link";

export function SocialLinks() {
  return (
    <div className="flex justify-center lg:justify-start gap-4 mt-4">
      {socialLinks.map((link) => {
        const Icon = link.icon;

        return link.isEmail ? (
          <a
            key={link.name}
            href={link.href}
            className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Icon />
            <span className="sr-only">{link.name}</span>
          </a>
        ) : (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Icon />
            <span className="sr-only">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
