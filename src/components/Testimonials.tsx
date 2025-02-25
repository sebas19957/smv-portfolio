"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    text: "Sebastián es una persona responsable y comprometida con las labores asignadas. Le gustan los retos técnicos y aportar soluciones desde el desarrollo para que el usuario tenga una mejor experiencia. Tiene pensamiento crítico y expresa sus ideas con libertad y convicción. Es muy buen compañero y aporta al crecimiento del equipo de trabajo. Es autodidacta y busca estar actualizado en los temas de su interés y aplica lo aprendido en su trabajo. Agradezco todo su aporte y acompañamiento en el tiempo que compartimos y trabajamos juntos.",
    author: "Paula Andrea Bolivar Uribe",
    role: "Ingeniera de Sistemas / Project Manager / Software Development Lead",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/testimony_paula.jpg",
  },
  {
    id: 2,
    text: "Tuve la oportunidad de colaborar con Sebastián en varios proyectos, tanto académicos como laborales. Destacó por su gran conocimiento, compromiso y disposición para aprender y mejorar constantemente. Además, su actitud positiva, resiliencia y compañerismo hicieron que trabajar con él fuera una experiencia muy enriquecedora. Es un profesional invaluable.",
    author: "Diego Fernando Piedrahita Arango",
    role: "Desarrollador backend / Automatizador de procesos",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/testimony_diego.jpg",
  },
  {
    id: 3,
    text: "Sebastián se caracteriza por ser un profesional apasionado por su carrera, siempre está en pro del aprendizaje continuo y en busca de nuevos retos que le permitan crecer profesional y personalmente. Dentro de sus aptitudes están su atención al detalle, la innovación y la colaboración en equipo, adicionalmente, se caracteriza por su lealtad, responsabilidad y compromiso pues son pilares de su personalidad.",
    author: "Vanessa Uribe Echavarría",
    role: "Profesional en administración financiera",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/testimony_vanessa.jpg",
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section
      id="testimonials"
      className="py-24 relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px]"
          >
            <div className="absolute inset-0 bg-white/10 -left-4 top-4 rounded-2xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative h-full"
              >
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  fill
                  className="object-cover object-center rounded-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-xl mb-4 block"
            >
              Testimonios
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Lo que dice la gente
            </motion.h2>
            <div className="relative">
              <Quote className="absolute -left-8 -top-8 w-16 h-16 opacity-20" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <p className="text-xl italic leading-relaxed">
                    {testimonials[currentIndex].text}
                  </p>
                  <div>
                    <p className="text-xl font-semibold">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-primary-foreground/80">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
