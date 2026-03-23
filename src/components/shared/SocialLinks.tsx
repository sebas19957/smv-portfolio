"use client";

import { socialLinks } from "@/lib/data/socialLinks";
import Link from "next/link";

export function SocialLinks() {
  const linkStyles = "size-9 border border-foreground/40 flex items-center justify-center text-foreground/60 hover:border-foreground hover:text-foreground transition-colors";

  return (
    <div className="flex justify-start gap-4 mt-6">
      {socialLinks.map((link) => {
        const Icon = link.icon;

        return link.isEmail ? (
          <a
            key={link.name}
            href={link.href}
            className={linkStyles}
          >
            <Icon className="size-4" />
            <span className="sr-only">{link.name}</span>
          </a>
        ) : (
          <Link
            key={link.name}
            href={link.href}
            target="_blank"
            className={linkStyles}
          >
            <Icon className="size-4" />
            <span className="sr-only">{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
