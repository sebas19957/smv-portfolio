import { Education, Experience } from "@/types/resume";

export const education: Education[] = [
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

export const experience: Experience[] = [
  {
    position: "Desarrollador Web",
    company: "Mercadeo Virtual S.A",
    period: "Marzo 2021 - Febrero 2025",
    location: "Medellín, Colombia",
    description:
      "Encargado del desarrollo y mantenimiento de interfaces web, optimización de bases de datos y despliegue de aplicaciones en entornos cloud y locales.",
    technologies: [
      "React.js",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind",
      "Redux",
      "Zustand",
      "Node.js",
      "Express.js",
      "Webpack",
      "GraphQL",
      "SQL Server",
      "MongoDB",
      "PostgreSQL",
      "Nest.js",
      "GitHub",
      "Docker",
      "Jest",
      "React Testing Library",
    ],
    responsibilities: [
      "Desarrollo y mantenimiento de interfaces web responsivas.",
      "Diseño e implementación de APIs REST y GraphQL.",
      "Optimización y gestión de bases de datos relacionales y NoSQL.",
      "Automatización de despliegues y CI/CD con Docker y GitHub Actions.",
      "Análisis y solución de incidencias en producción.",
      "Implementación de pruebas unitarias y de integración para mejorar la calidad del código.",
    ],
    achievements: [
      "Desarrollé nuevos sitios web y mejoré la arquitectura de proyectos existentes.",
      "Migré y optimicé servicios internos utilizando Nest.js y Node.js, mejorando la eficiencia del backend en un 30%.",
      "Automaticé el proceso de despliegue en infraestructura propia y en la nube (IIS, GCP, AWS, Azure y Vercel).",
      "Reduje el tiempo de carga de las aplicaciones en un 40% mediante optimización de assets y consultas a la base de datos.",
      "Desarrollé herramientas internas para mejorar la productividad de los equipos de trabajo.",
    ],
  },
  {
    position: "Desarrollador Web",
    company: "Atlas Global Solutions",
    period: "Enero 2020 - Noviembre 2020",
    location: "Medellín, Colombia",
    description:
      "Responsable del mantenimiento y personalización de WordPress, integración de formularios y soporte técnico básico en Salesforce.",
    technologies: ["Salesforce", "HTML", "CSS", "WordPress", "PHP"],
    responsibilities: [
      "Mantenimiento y actualización de contenido en WordPress.",
      "Personalización de plantillas y ajustes de estilos con HTML y CSS.",
      "Gestión y configuración de datos en Salesforce.",
      "Soporte técnico para incidencias menores en la plataforma.",
    ],
    achievements: [
      "Actualicé formularios y mejoré la usabilidad en WordPress.",
      "Optimicé estilos y diseño mediante ajustes en HTML y CSS.",
      "Automaticé procesos básicos dentro de Salesforce para mejorar la gestión de datos.",
      "Desarrollé templates de correo personalizados en Salesforce para campañas de marketing.",
      "Implementé pruebas unitarias en Salesforce para validar la funcionalidad de los módulos personalizados.",
    ],
  },
];
