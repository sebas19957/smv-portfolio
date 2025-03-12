"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { testimonials } from "@/lib/data/testimonials";
import { Button } from "./ui/button";

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
      className="py-16 relative overflow-hidden bg-primary text-primary-foreground"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-center lg:space-x-12">
          {/* Imagen (oculta en móviles) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="hidden md:block relative w-full max-w-sm lg:max-w-md mx-auto"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
              >
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  fill
                  className="object-cover object-center rounded-2xl"
                  priority={currentIndex === 0}
                  quality={75}
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  sizes="(max-width: 768px) 0px, (max-width: 1024px) 40vw, 30vw"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Contenido del testimonio */}
          <div className="w-full max-w-lg mx-auto text-center lg:text-left space-y-6">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-lg block"
            >
              Testimonios
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold"
            >
              Lo que dice la gente
            </motion.h2>
            <div className="relative">
              <Quote className="absolute -left-6 -top-6 w-12 h-12 opacity-20" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-lg italic leading-relaxed">
                    {testimonials[currentIndex].text}
                  </p>
                  <div>
                    <p className="text-lg font-semibold">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-primary-foreground/80 text-sm">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center lg:justify-start gap-3 mt-6">
                <Button
                  onClick={handlePrevious}
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
