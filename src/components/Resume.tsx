"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase } from "lucide-react";

const education = [
  {
    degree: "Ingeniería de Sistemas",
    school: "Universidad de Medellín",
    period: "2018 - 2025",
    description:
      "Formación en ingeniería de sistemas, con énfasis en Ingenierría de Software, Logíca Programación.",
  },
  {
    degree: "Gestión de Procesos Administrativos en Salud",
    school: "Institución Universitaria Escolme (SENA)",
    period: "2014 - 2016",
    description:
      "Formación técnica en gestión de procesos administrativos en el sector salud.",
  },
  {
    degree: "Diplomado React.js y Next.js",
    school: "Udemy",
    period: "2020",
    description: "Especialización en desarrollo web con React.js y Next.js.",
  },
];

const experience = [
  {
    position: "Analista Desarrollador Senior",
    company: "Mercadeo Virtual S.A",
    period: "2020 - 2025",
    description:
      "Desarrollo e implementación de aplicaciones web, APIs y Despliegues con React.js, Next.js, Sql Server, Mongo DB, JavaScript, TypeScript, Nest.js y más",
  },
  {
    position: "Programador Saleforce",
    company: "Atlas Global Solutions, Inc.",
    period: "2018 - 2019",
    description:
      "Desarrollo y personalización de soluciones básicas en la plataforma Salesforce.",
  },
];

export function Resume() {
  return (
    <section id="resume" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto md:text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="text-4xl sm:text-5xl font-bold mb-4"
          >
            Mi Currículum
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            Disfruto de cada paso del proceso de desarrollo de software, desde
            la concepción inicial y la lluvia de ideas, hasta la planificación y
            el diseño de la arquitectura. Me entusiasma la colaboración con
            otros desarrolladores o colaboradores dentro del proceso, así como
            la oportunidad de resolver problemas complejos y encontrar
            soluciones creativas.
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="h-1 w-8 bg-primary" />
              <h3 className="text-2xl font-bold">Educación</h3>
            </motion.div>
            <div className="space-y-8">
              {education.map((item, index) => (
                <motion.div
                  key={item.degree}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold">{item.degree}</h4>
                      <span className="text-sm text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">
                      {item.school}
                    </p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="flex items-center gap-2 mb-8"
            >
              <div className="h-1 w-8 bg-primary" />
              <h3 className="text-2xl font-bold">Experiencia</h3>
            </motion.div>
            <div className="space-y-8">
              {experience.map((item, index) => (
                <motion.div
                  key={item.position}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xl font-bold">{item.position}</h4>
                      <span className="text-sm text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-lg text-muted-foreground mb-2">
                      {item.company}
                    </p>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
