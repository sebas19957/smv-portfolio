import { Project } from "@/types/project";

export const projects: Project[] = [
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
