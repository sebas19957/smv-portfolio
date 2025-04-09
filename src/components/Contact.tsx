"use client";

import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

import EmailForm from "./EmailContactForm";
import { useLanguage } from "@/contexts/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-primary font-medium mb-4 block"
            >
              {t("contact.title")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
            >
              {t("contact.subtitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mb-8 max-w-lg"
            >
              {t("contact.subtitle2")}
            </motion.p>
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.phone")}
                  </p>
                  <p className="text-lg font-medium text-primary">
                    +57 311 612 38 19
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("contact.email")}
                  </p>
                  <p className="text-lg font-medium text-primary">
                    <a
                      href="mailto:sebas19957@hotmail.com"
                      className="hover:underline"
                    >
                      sebas19957@hotmail.com
                    </a>
                    <span className="mx-1">-</span>
                    <a
                      href="mailto:sebasmval@gmail.com"
                      className="hover:underline"
                    >
                      sebasmval@gmail.com
                    </a>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <EmailForm />
        </div>
      </div>
    </section>
  );
}
