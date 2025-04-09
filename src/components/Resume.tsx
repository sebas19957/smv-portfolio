"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { educationByLanguage, experienceByLanguage } from "@/lib/data/resume";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

export function Resume() {
  const { language, t } = useLanguage();
  const education = educationByLanguage[language];
  const experience = experienceByLanguage[language];

  return (
    <section id="resume" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            {t("resume.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            {t("resume.subtitle")}
          </motion.p>
        </header>

        {/* Sección de Experiencia */}
        <section className="mb-20">
          <header className="flex items-center gap-2 mb-8">
            <div className="h-1 w-8 bg-primary" />
            <h3 className="text-2xl font-bold">{t("resume.subtitle2")}:</h3>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {experience.map((job, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 border border-input rounded-lg shadow-sm"
              >
                <header className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{job.position}</h4>
                    <p className="text-lg text-muted-foreground">
                      {job.company} - {job.location}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {job.period}
                    </span>
                  </div>
                </header>

                <p className="mt-3 text-muted-foreground">{job.description}</p>

                <h5 className="font-semibold mt-4">
                  {t("resume.experience.subtitle1")}:
                </h5>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  {job.responsibilities.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>

                <h5 className="font-semibold mt-4">
                  {t("resume.experience.subtitle2")}:
                </h5>
                <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                  {job.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Sección de Educación */}
        <section>
          <header className="flex items-center gap-2 mb-8">
            <div className="h-1 w-8 bg-primary" />
            <h3 className="text-2xl font-bold">{t("resume.subtitle3")}</h3>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {education.map((item, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-6 border border-input rounded-lg shadow-sm"
              >
                <header className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{item.degree}</h4>
                    <p className="text-lg text-muted-foreground">
                      {item.school}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      {item.period}
                    </span>
                  </div>
                </header>

                <p className="mt-3 text-muted-foreground">{item.description}</p>
              </motion.article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
