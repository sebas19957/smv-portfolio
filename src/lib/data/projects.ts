import { Project } from "@/types/project";

export const projectsES: Project[] = [
  {
    id: 1,
    title: "Web Remember",
    description:
      "Plataforma web para gestión centralizada de URLs, accesible desde cualquier lugar. Permite organizar y guardar enlaces para optimizar el acceso a información relevante.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/webremember.webp",
    category: "personal",
    technologies: ["Next.js", "TypeScript", "Shadcn", "Tailwind CSS"],
    demoUrl: "https://webremember.com/",
  },
  {
    id: 2,
    title: "NoSeMePasa",
    description:
      "Aplicación móvil diseñada para ayudar a los usuarios a recordar, organizar y controlar sus pagos, facturas y suscripciones en un solo lugar. Permite visualizar fechas importantes en un calendario interactivo, recibir recordatorios inteligentes y acceder a reportes mensuales con información clara sobre su comportamiento financiero. Su enfoque está en reducir el estrés financiero y mejorar la organización personal mediante una experiencia simple, moderna y confiable.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nosemepasa.webp",
    category: "personal",
    technologies: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL", "Expo Notifications", "Victory Native", "Tamagui"],
  },
  {
    id: 3,
    title: "Pagina Web InformPorcinos®",
    description:
      "Plataforma de Información y Sistema de Trazabilidad para el Sector Cárnico.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/infoporcinos.webp",
    category: "company",
    technologies: ["Next.js", "Material UI", "Typescript"],
    demoUrl: "https://www.infoporcinos.com/",
  },
  {
    id: 4,
    title: "Aldental - Gestión de Órdenes de Compra",
    description:
      "Aplicación para cargar y validar órdenes de compra a partir de archivos Excel. Genera archivos en formato '.txt' para SIESA y detecta errores de validación en precios y puntos de envío. Los datos se gestionan a través de una API y se almacenan en la base de datos.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/aldental.webp",
    category: "company",
    technologies: ["Next.js", "Material UI", "Typescript", "Axios"],
    demoUrl: "#",
  },
  {
    id: 5,
    title: "SebasShop Ecommerce",
    description:
      "He desarrollado una plataforma de ecommerce funcional para demostrar mis capacidades en el diseño y desarrollo de tiendas en línea.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/sebasshop.webp",
    category: "personal",
    technologies: ["Next.js", "Material UI", "Typescript"],
    demoUrl: "https://sebas-shop-ji1mgl31n-sebas19957.vercel.app/",
    githubUrl: "https://github.com/sebas19957/Sebas-shop",
  },
  {
    id: 6,
    title: "API Reportes Mensuales",
    description:
      "API que genera y envía reportes personalizados de producción a tus clientes. Recopila datos, crea PDFs con estadísticas y análisis, y los envía masivamente por correo electrónico, incluyendo un email template con información adicional. Automatiza, personaliza, escala y mejora la comunicación con tus clientes.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "company",
    technologies: ["Node.js", "Nest.js", "MongoDB", "React-pdf", "HTML", "CSS"],
  },
  {
    id: 7,
    title: "API Web Remember",
    description:
      "Desarrollamos una API robusta y escalable que se integra con la página web Remember para ofrecer una gestión integral de URLs y funcionalidades de comunicación con el usuario final y el equipo de desarrollo.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "personal",
    technologies: ["Node.js", "Nest.js", "MongoDB", "React-pdf", "HTML", "CSS"],
  },
  {
    id: 8,
    title: "Aldental - Backend Procesamiento de Órdenes de Compra API",
    description:
      "Backend para procesar y validar órdenes de compra desde archivos Excel, generando archivos `.txt` compatibles con SIESA. Gestiona la persistencia de datos y valida las órdenes de compra, almacenándolas en una base de datos centralizada.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "company",
    technologies: ["Node.js", "Nest.js", "SQL Server"],
    demoUrl: "#",
  },
];

export const projectsEN: Project[] = [
  {
    id: 1,
    title: "Web Remember",
    description:
      "Web platform for centralized URL management, accessible from anywhere. It allows users to organize and save links to optimize access to relevant information.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/webremember.webp",
    category: "personal",
    technologies: ["Next.js", "Supabase", "TypeScript", "Shadcn", "Tailwind CSS"],
    demoUrl: "https://webremember.com/",
  },
  {
    id: 2,
    title: "NoSeMePasa",
    description:
      "Mobile application designed to help users remember, organize and control their payments, invoices and subscriptions in one place. It allows you to view important dates in an interactive calendar, receive smart reminders and access monthly reports with clear information about your financial behavior. Its focus is on reducing financial stress and improving personal organization through a simple, modern and reliable experience.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nosemepasa.webp",
    category: "personal",
    technologies: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL", "Expo Notifications", "Victory Native", "Tamagui"],
  },
  {
    id: 3,
    title: "InformPorcinos® Website",
    description:
      "Information Platform and Traceability System for the Meat Sector.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/infoporcinos.webp",
    category: "company",
    technologies: ["Next.js", "Material UI"],
    demoUrl: "https://www.infoporcinos.com/",
  },
  {
    id: 4,
    title: " Aldental - Purchase Order Management ",
    description:
      "Application to upload and validate purchase orders from Excel files. It generates files in '.txt' format for SIESA and detects validation errors in prices and shipping points. The data is managed through an API and stored in the database.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/aldental.webp",
    category: "company",
    technologies: ["Next.js", "Material UI", "Typescript", "Axios"],
  },
  {
    id: 5,
    title: "SebasShop Ecommerce",
    description:
      "I developed a functional ecommerce platform to demonstrate my skills in designing and developing online stores.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/sebasshop.webp",
    category: "personal",
    technologies: ["Next.js", "Material UI", "Typescript"],
    demoUrl: "https://sebas-shop-ji1mgl31n-sebas19957.vercel.app/",
    githubUrl: "https://github.com/sebas19957/Sebas-shop",
  },
  {
    id: 6,
    title: "Monthly Reports API",
    description:
      "An API that generates and sends personalized production reports to your clients. It collects data, creates PDFs with statistics and analysis, and sends them in bulk via email, including an email template with additional information. Automate, customize, scale, and improve communication with your clients.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "company",
    technologies: [
      "Node.js",
      "Nest.js",
      "MongoDB",
      "Typescript",
      "React-pdf",
      "HTML",
      "CSS",
    ],
  },
  {
    id: 7,
    title: "Web Remember API",
    description:
      "We developed a robust and scalable API that integrates with the Web Remember site to provide comprehensive URL management and functionalities for communication with both the end user and the development team.",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "personal",
    technologies: ["Node.js", "Nest.js", "MongoDB", "Typescript"],
    githubUrl: "https://github.com/sebas19957/backend-web-remember",
  },
  {
    id: 8,
    title: " Aldental - Backend Purchase Order Processing API",
    description:
      "Backend to process and validate purchase orders from Excel files, generating SIESA-compliant '.txt' files. Manage data persistence and validate purchase orders, storing them in a centralized database. ",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/portfolio/nest.webp",
    category: "company",
    technologies: ["Node.js", "Nest.js", "SQL Server", "Typescript"],
  },
];

export const projectsByLanguage = {
  es: projectsES,
  en: projectsEN,
};
