"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { educationByLanguage, experienceByLanguage } from "@/lib/data/resume";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

export function Resume() {
  const { language, t } = useLanguage();
  const education = educationByLanguage[language];
  const experience = experienceByLanguage[language];

  return (
    <section id="resume" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6"
            style={{
              fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            }}
          >
            <span
              style={{
                WebkitTextStroke: "2px #facc15",
                WebkitTextFillColor: "transparent",
              }}
            >
              {String(t("resume.title")).split(" ")[0]}
            </span>{" "}
            <span className="text-foreground">
              {String(t("resume.title")).split(" ").slice(1).join(" ")}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("resume.subtitle")}
          </motion.p>
        </div>

        {/* Layout de 2 columnas */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Columna izquierda - Work Experience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-6 h-6 text-yellow-400" />
              <h3
                className="text-3xl sm:text-4xl font-black uppercase text-yellow-400"
                style={{
                  fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                }}
              >
                {t("resume.subtitle2")}
              </h3>
            </div>

            <div className="space-y-16">
              {experience.map((job, index) => {
                const cardRotations = [-1.5, 1];
                const badgeRotations = [-2, 1.5];
                const cardRotation = cardRotations[index % cardRotations.length];
                const badgeRotation = badgeRotations[index % badgeRotations.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Badge de posición - fuera de la card con rotación */}
                    <div
                      className="absolute -top-4 left-2 z-10"
                      style={{ transform: `rotate(${badgeRotation}deg)` }}
                    >
                      <span
                        className="inline-block bg-yellow-400 text-black px-4 py-1 font-black text-lg uppercase"
                        style={{
                          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        }}
                      >
                        {job.position}
                      </span>
                    </div>

                    {/* Card con rotación */}
                    <article
                      className="bg-zinc-900 p-6 pt-8"
                      style={{ transform: `rotate(${cardRotation}deg)`, backgroundColor: "#18181b" }}
                    >
                      {/* Empresa y ubicación */}
                      <h4
                        className="text-xl font-bold text-white mb-0.5"
                        style={{
                          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        }}
                      >
                        {job.company}
                      </h4>
                      <p className="text-xs text-yellow-400 mb-4">
                        {job.location} | {job.period}
                      </p>

                      {/* Responsabilidades como lista */}
                      <ul className="space-y-2 mb-4">
                        {job.responsibilities.slice(0, 4).map((task, i) => (
                          <li key={i} className="flex items-baseline gap-2">
                            <span className="text-gray-500 flex-shrink-0">-</span>
                            <span className="text-gray-400 text-sm">{task}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Achievements */}
                      <div>
                        <h5
                          className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-2"
                          style={{
                            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                          }}
                        >
                          {t("resume.experience.subtitle2")}
                        </h5>
                        <ul className="space-y-2">
                          {job.achievements.slice(0, 3).map((ach, i) => (
                            <li key={i} className="flex items-baseline gap-2">
                              <span className="text-yellow-400 flex-shrink-0">•</span>
                              <span className="text-gray-400 text-sm">{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Columna derecha - Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-6 h-6 text-yellow-400" />
              <h3
                className="text-3xl sm:text-4xl font-black uppercase text-yellow-400"
                style={{
                  fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                }}
              >
                {t("resume.subtitle3")}
              </h3>
            </div>

            <div className="space-y-16">
              {education.map((item, index) => {
                const cardRotations = [1, -1.5, 0.8];
                const badgeRotations = [1.5, -2, 1];
                const cardRotation = cardRotations[index % cardRotations.length];
                const badgeRotation = badgeRotations[index % badgeRotations.length];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    {/* Badge de tipo - fuera de la card con rotación */}
                    <div
                      className="absolute -top-4 left-2 z-10"
                      style={{ transform: `rotate(${badgeRotation}deg)` }}
                    >
                      <span
                        className="inline-block bg-yellow-400 text-black px-4 py-1 font-black text-lg uppercase"
                        style={{
                          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        }}
                      >
                        {item.degree.split(" ")[0]}
                      </span>
                    </div>

                    {/* Card con rotación */}
                    <article
                      className="bg-zinc-900 p-6 pt-8"
                      style={{ transform: `rotate(${cardRotation}deg)`, backgroundColor: "#18181b" }}
                    >
                      {/* Grado */}
                      <h4
                        className="text-xl font-bold text-white mb-0.5"
                        style={{
                          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        }}
                      >
                        {item.degree}
                      </h4>
                      <p className="text-xs text-yellow-400 mb-4">
                        {item.school} | {item.period}
                      </p>

                      {/* Descripción */}
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </article>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
