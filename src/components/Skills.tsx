"use client";

import { skills } from "@/lib/data/skills";
import { motion } from "framer-motion";

export function Skills() {
  const categories = Array.from(new Set(skills.map((skill) => skill.category)));

  return (
    <section
      id="skills"
      className="py-24 relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="text-xl mb-4 block font-bold"
        >
          Mis Habilidades
        </motion.span>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
            >
              Más de 4 años de
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold"
            >
              experiencia
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="text-lg max-w-lg"
            >
              Desarrollador Frontend con amplia experiencia en tecnologías web
              modernas y una sólida formación en desarrollo backend y prácticas
              DevOps.
            </motion.p>
          </div>
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 + categoryIndex * 0.1 }}
                className="space-y-4"
              >
                <h4 className="text-xl font-semibold">{category}</h4>
                <div className="grid gap-6 sm:grid-cols-2">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex justify-between text-sm font-medium">
                          <span>{skill.name}</span>
                          <span>{skill.percentage}%</span>
                        </div>
                        <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.percentage}%` }}
                            viewport={{ once: false }}
                            transition={{
                              duration: 1,
                              delay: 0.5 + index * 0.1,
                            }}
                            className="h-full bg-primary-foreground rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
