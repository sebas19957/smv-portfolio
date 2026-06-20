"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { testimonialsByLanguage } from "@/lib/data/testimonials";
import { Button } from "./ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Testimonials() {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = testimonialsByLanguage[language];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section
      id="testimonials"
      className="py-16 relative overflow-hidden bg-primary text-primary-foreground"
      style={{
        backgroundImage:
          'url("https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/bg-6.webp")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 xl:px-20">
        <div className="flex flex-col items-center xl:flex-row xl:items-center xl:justify-center xl:gap-16">
          {/* Contenido del testimonio */}
          <div className="w-full max-w-xl mx-auto text-center xl:text-left xl:flex-1 space-y-4">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-sm font-bold uppercase tracking-widest block mb-2"
            >
              {t("testimonials.title")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black"
              style={{
                fontFamily:
                  "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
              }}
            >
              {(() => {
                const words = String(t("testimonials.subtitle")).split(" ");
                const mid = Math.ceil(words.length / 2);
                return (
                  <>
                    <span
                      style={{
                        WebkitTextStroke: "2px #000",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {words.slice(0, mid).join(" ")}
                    </span>{" "}
                    <span className="text-black">
                      {words.slice(mid).join(" ")}
                    </span>
                  </>
                );
              })()}
            </motion.h2>
            <div className="relative">
              <Quote className="absolute -left-6 -top-6 w-12 h-12 opacity-20" />

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

              {/* Botones de navegación */}
              <div className="flex justify-center gap-3 mt-6">
                <Button
                  onClick={handlePrevious}
                  className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Previous testimonial"
                  size="icon"
                >
                  <ChevronLeft className="w-10 h-10" />
                </Button>
                <Button
                  onClick={handleNext}
                  className="p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                  aria-label="Next testimonial"
                  size="icon"
                >
                  <ChevronRight className="w-10 h-10" />
                </Button>
              </div>
            </div>
          </div>

          {/* Imagen del testimonio */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="w-full max-w-md xl:max-w-lg xl:w-[450px] xl:shrink-0 mt-8 xl:mt-0"
          >
            {/* Precargar todas las imágenes */}
            <div className="hidden">
              {testimonials.map((testimonial, index) => (
                <Image
                  key={`preload-${index}`}
                  src={testimonial.image || "/placeholder.svg"}
                  alt=""
                  width={450}
                  height={450}
                  priority
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full"
              >
                <Image
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  priority
                  loading="eager"
                  className="object-contain object-center w-full h-auto"
                  width={450}
                  height={450}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
