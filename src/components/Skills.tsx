"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import SkillCard from "./shared/SkillCard";
import { getSkills } from "./shared/SkillsList";
import { Button } from "./ui/button";
import { Category } from "@/types/skills";

// Definición de tipos
type CategoryId = "all" | "frontend" | "backend" | "devops" | "cloud";

export function Skills() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");

  const categories: Category[] = [
    { id: "all", name: `${t("skills.button")}` },
    { id: "frontend", name: "Frontend" },
    { id: "backend", name: "Backend" },
    { id: "devops", name: "DevOps & Testing" },
    { id: "cloud", name: "Cloud" },
  ];

  const skills = getSkills(activeCategory);

  return (
    <section
      id="skills"
      className="py-16 px-4 min-h-screen"
      style={{
        backgroundImage:
          'url("https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/bg-6.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-left max-w-2xl text-black">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
              className="text-2xl mb-2 font-bold"
            >
              {t("skills.title")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl mb-4 font-bold"
            >
              {t("skills.subtitle")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl"
            >
              {t("skills.description")}
            </motion.p>
          </div>
          <div className="relative flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="flex justify-center lg:justify-start items-center mt-8"
            >
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-down-r.webp"
                alt="Descripción de la imagen"
                width={300}
                height={300}
                className="w-[300px] h-[300px] hidden lg:block"
              />
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-down.webp"
                alt="Descripción de la imagen"
                width={300}
                height={300}
                className="w-[300px] h-[300px] block lg:hidden"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all text-sm hover:bg-white/30 ${
                activeCategory === category.id
                  ? "bg-white shadow-lg text-black"
                  : "bg-white/20 hover:bg-white/50"
              }`}
            >
              {category.name}
            </Button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4"
        >
          {skills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
