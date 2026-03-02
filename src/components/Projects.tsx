"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { projectsByLanguage } from "@/lib/data/projects";
import { useLanguage } from "@/contexts/LanguageContext";

export function Projects() {
  const { language, t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "company" | "personal"
  >("all");

  const projects = projectsByLanguage[language];

  const filteredProjects = projects.filter((project) =>
    selectedCategory === "all" ? true : project.category === selectedCategory
  );

  const rotations = [-1.5, 1, 0.5, -0.8, 1.2, -1];
  const badgeRotations = [-2, 1.5, -1, 2, -1.5, 1];

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="md:text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4 block"
          >
            {t("projects.title")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6"
            style={{
              fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
            }}
          >
            {(() => {
              const words = String(t("projects.subtitle")).split(" ");
              const mid = Math.ceil(words.length / 2);
              return (
                <>
                  <span
                    style={{
                      WebkitTextStroke: "2px #facc15",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {words.slice(0, mid).join(" ")}
                  </span>{" "}
                  <span className="text-foreground">{words.slice(mid).join(" ")}</span>
                </>
              );
            })()}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t("projects.subtitle2")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4 }}
            className="text-muted-foreground max-w-4xl mx-auto mt-4 text-xs"
          >
            {t("projects.subtitle3")}
          </motion.p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "bg-yellow-400 text-black hover:bg-yellow-500 font-bold" : "text-white border-yellow-400 hover:bg-yellow-400/10 font-bold"}
          >
            {t("projects.button")}
          </Button>
          <Button
            variant={selectedCategory === "company" ? "default" : "outline"}
            onClick={() => setSelectedCategory("company")}
            className={selectedCategory === "company" ? "bg-yellow-400 text-black hover:bg-yellow-500 font-bold" : "text-white border-yellow-400 hover:bg-yellow-400/10 font-bold"}
          >
            {t("projects.button2")}
          </Button>
          <Button
            variant={selectedCategory === "personal" ? "default" : "outline"}
            onClick={() => setSelectedCategory("personal")}
            className={selectedCategory === "personal" ? "bg-yellow-400 text-black hover:bg-yellow-500 font-bold" : "text-white border-yellow-400 hover:bg-yellow-400/10 font-bold"}
          >
            {t("projects.button3")}
          </Button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 pt-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const cardRotation = rotations[index % rotations.length];
              const badgeRotation = badgeRotations[index % badgeRotations.length];

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: false }}
                  className="relative group"
                >
                  {/* Badge de Categoría */}
                  <div
                    className="absolute -top-5 left-4 z-20"
                    style={{ transform: `rotate(${badgeRotation}deg)` }}
                  >
                    <span
                      className="inline-block px-4 py-1.5 font-black text-sm uppercase shadow-md"
                      style={{
                        fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        backgroundColor: "#f5c518",
                        color: "#000",
                      }}
                    >
                      {project.category === "company" ? t("projects.button2") : t("projects.button3")}
                    </span>
                  </div>

                  {/* Tarjeta del Proyecto */}
                  <article
                    className="h-full bg-zinc-900 overflow-hidden shadow-lg border border-zinc-800 flex flex-col transition-all duration-300 group-hover:border-yellow-400/50"
                    style={{
                      backgroundColor: "#18181b",
                      transform: `rotate(${cardRotation}deg)`,
                    }}
                  >
                    {/* Imagen del Proyecto */}
                    <div className="aspect-video relative overflow-hidden border-b border-zinc-800">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      
                      {/* Overlay con botones */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
                        {project.demoUrl && project.demoUrl !== "#" && (
                          <Button size="sm" asChild className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
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
                          <Button size="sm" variant="outline" asChild className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 font-bold">
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
                    
                    {/* Contenido */}
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 
                        className="text-2xl font-black mb-3 text-white line-clamp-2"
                        style={{
                          fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                        }}
                      >
                        {project.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed line-clamp-4">
                        {project.description}
                      </p>
                      
                      {/* Tecnologías */}
                      <div>
                        <h5
                          className="text-xs font-black text-yellow-400 uppercase tracking-wider mb-3"
                          style={{
                            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                          }}
                        >
                          Technologies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-xs font-medium px-2.5 py-1 bg-black/40 text-gray-300 border border-zinc-700"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
