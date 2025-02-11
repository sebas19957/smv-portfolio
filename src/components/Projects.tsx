"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: "company" | "personal";
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "Pagina Web InformPorcinos®",
    description:
      "Plataforma de Información y Sistema de Trazabilidad para el Sector Cárnico.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/infoporcinos.png",
    category: "company",
    technologies: ["Next.js", "Material UI"],
    demoUrl: "https://www.infoporcinos.com/",
  },
  {
    id: 2,
    title: "Web Remember",
    description:
      "Plataforma web para gestión centralizada de URLs, accesible desde cualquier lugar. Permite organizar y guardar enlaces para optimizar el acceso a información relevante.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/webremember.png",
    category: "personal",
    technologies: ["Next.js", "TypeScript", "Nest UI", "Typescript"],
    demoUrl: "#",
  },
  {
    id: 3,
    title: "SebasShop Ecommerce",
    description:
      "He desarrollado una plataforma de ecommerce funcional para demostrar mis capacidades en el diseño y desarrollo de tiendas en línea.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/sebasshop.png",
    category: "personal",
    technologies: ["Next.js", "Material UI", "Typescript"],
    demoUrl: "https://sebas-shop-ji1mgl31n-sebas19957.vercel.app/",
    githubUrl: "https://github.com/sebas19957/Sebas-shop",
  },
  {
    id: 4,
    title: "API Reportes Mensuales",
    description:
      "API que genera y envía reportes personalizados de producción a tus clientes. Recopila datos, crea PDFs con estadísticas y análisis, y los envía masivamente por correo electrónico, incluyendo un email template con información adicional. Automatiza, personaliza, escala y mejora la comunicación con tus clientes.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.png",
    category: "company",
    technologies: ["Node.js", "Nest.js", "MongoDB", "React-pdf", "HTML", "CSS"],
  },
  {
    id: 5,
    title: "API Web Remember",
    description:
      "Desarrollamos una API robusta y escalable que se integra con la página web Remember para ofrecer una gestión integral de URLs y funcionalidades de comunicación con el usuario final y el equipo de desarrollo.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.png",
    category: "personal",
    technologies: ["Node.js", "Nest.js", "MongoDB", "React-pdf", "HTML", "CSS"],
    githubUrl: "https://github.com/sebas19957/backend-web-remember",
  },
];

export function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "company" | "personal"
  >("all");

  const filteredProjects = projects.filter((project) =>
    selectedCategory === "all" ? true : project.category === selectedCategory
  );

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="text-primary font-medium mb-4 block"
          >
            Mi Trabajo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
          >
            Proyectos Destacados
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Una colección de proyectos en los que he trabajado, tanto a nivel
            profesional como personal.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-4xl mx-auto mt-4 text-xs"
          >
            Por razones de confidencialidad y en cumplimiento de acuerdos de
            privacidad establecidos con las empresas en las que trabajé, no
            puedo revelar detalles sobre algunos proyectos clave en los que
            participé, a pesar de que fueron fundamentales para mi desarrollo
            profesional.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-12"
        >
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
          >
            Todos los Proyectos
          </Button>
          <Button
            variant={selectedCategory === "company" ? "default" : "outline"}
            onClick={() => setSelectedCategory("company")}
          >
            Proyectos de la Esmpresa
          </Button>
          <Button
            variant={selectedCategory === "personal" ? "default" : "outline"}
            onClick={() => setSelectedCategory("personal")}
          >
            Proyectos Personales
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: false }}
                className="group relative bg-card rounded-2xl overflow-hidden"
              >
                <div className="aspect-video relative">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-opacity flex items-center justify-center gap-4">
                    {project.demoUrl && (
                      <Button size="sm" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {project.githubUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
