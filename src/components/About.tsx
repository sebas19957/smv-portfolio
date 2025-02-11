"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import RotatingText from "./RotatingText";
import { DownloadCVButton } from "./DownloadCVButton";

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto flex px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-10 lg:gap-40 items-center"
        >
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="aspect-[4/3] relative rounded-2xl overflow-hidden"
            >
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/myself_img_1.jpg"
                alt="About image 1"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-12 -right-12 w-80 aspect-[4/3] rounded-2xl overflow-hidden hidden lg:block"
            >
              <Image
                src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/myself_img_4.jpg"
                alt="About image 2"
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 -left-12 w-24 h-24 bg-primary/20 hidden lg:block"
            />
          </div>
          <div className="order-1 lg:order-2">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-primary font-medium mb-4 block"
            >
              Acerca de mí
            </motion.span>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                Soy <span className="text-primary">Sebastián</span>
              </h2>

              <RotatingText className="justify-start items-start" />
              <p className="text-lg sm:text-xl text-muted-foreground mb-4">
                Medellín, Antioquia, Colombia
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground">
                ¡Hola! Soy Sebastián Mosquera, desarrollador de software con más
                de 4 años de experiencia. Me encanta resolver desafíos técnicos
                y crear software de calidad
              </p>
              <p className="text-muted-foreground">
                Más allá de la técnica, el desarrollo de software es para mí una
                pasión que nace de la curiosidad y el deseo de aprender. Me
                entusiasma explorar nuevas tecnologías y herramientas, descubrir
                cómo funcionan las cosas y encontrar formas innovadoras de
                aplicarlas. Cada desafío es una oportunidad para crecer, para
                ampliar mis habilidades y conocimientos, y para convertirme en
                un mejor profesional. La programación es mi forma de expresión,
                mi manera de dejar mi huella en el mundo digital.
              </p>
              <p className="text-muted-foreground">
                Mi enfoque es construir soluciones escalables, eficientes y
                centradas en el usuario.
              </p>
              {/* <Button size="lg" className="mt-8 w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" /> Download CV
              </Button> */}
              <DownloadCVButton />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
