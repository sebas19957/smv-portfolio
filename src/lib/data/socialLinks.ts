import { SocialLink } from "@/types/socialLinks";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";

export const socialLinks: SocialLink[] = [
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
