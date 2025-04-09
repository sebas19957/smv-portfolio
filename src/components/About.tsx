"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import RotatingText from "./RotatingText";
import { useLanguage } from "@/contexts/LanguageContext";
import { DownloadCVButton } from "./shared/DownloadCVButton";

export function About() {
  const { tArray, t } = useLanguage();

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto flex px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-10 lg:gap-40 items-center"
        >
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="aspect-4/3 relative rounded-2xl overflow-hidden"
            >
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/myself/myself_1.webp"
                alt="About image 1"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-3/12 -right-10 lg:-bottom-8/12 lg:-right-12 xl:-bottom-12 xl:-right-12 w-80 aspect-4/3 rounded-2xl overflow-hidden hidden sm:block"
            >
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/myself/myself_2.webp"
                alt="About image 2"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 -left-12 w-24 h-24 bg-primary/20 hidden lg:block"
            />
          </div>
          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-primary font-medium mb-4 block"
            >
              {t("about.title")}
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                {t("about.name")}{" "}
                <span className="text-primary">{t("global.name")}</span>
              </h2>

              <RotatingText
                titles={tArray("global.profession")}
                className="justify-start items-start"
              />
              <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                {t("about.location")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground">{t("about.description")}</p>
              <p className="text-muted-foreground">{t("about.description2")}</p>
              <p className="text-muted-foreground">{t("about.description3")}</p>

              <DownloadCVButton />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
