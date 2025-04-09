"use client";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { SocialLinks } from "../shared/SocialLinks";
import { Logo } from "./Logo";

const links = [
  { key: "nav.home", href: "#home" },
  { key: "nav.about", href: "#about" },
  { key: "nav.skills", href: "#skills" },
  { key: "nav.resume", href: "#resume" },
  { key: "nav.projects", href: "#projects" },
  { key: "nav.testimonials", href: "#testimonials" },
  { key: "nav.contact", href: "#contact" },
];

export function Footer() {
  const { t } = useLanguage();

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
            <p className="text-muted-foreground max-w-sm">{t("footer.text")}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.links")}</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e) => handleClick(e, link.href)}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{t("footer.follow")}</h3>
            <div className="flex gap-4">
              <SocialLinks />
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.legal")}
          </p>
        </div>
      </div>
    </footer>
  );
}
