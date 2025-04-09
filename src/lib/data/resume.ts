import { Education, Experience } from "@/types/resume";

export const educationES: Education[] = [
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

export const educationEN: Education[] = [
  {
    degree: "Systems Engineering",
    school: "University of Medellín",
    period: "2018 - 2025",
    description:
      "Training in systems engineering, with an emphasis on Software Engineering, Programming Logic.",
  },
  {
    degree: "Health Administrative Process Management",
    school: "Escolme University Institution (SENA)",
    period: "2014 - 2016",
    description:
      "Technical training in administrative process management in the healthcare sector.",
  },
  {
    degree: "Diploma in React.js and Next.js",
    school: "Udemy",
    period: "2020",
    description: "Specialization in web development with React.js and Next.js.",
  },
];

export const experienceES: Experience[] = [
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

export const experienceEN: Experience[] = [
  {
    position: "Web Developer",
    company: "Mercadeo Virtual S.A",
    period: "March 2021 - February 2025",
    location: "Medellín, Colombia",
    description:
      "Responsible for the development and maintenance of web interfaces, database optimization, and deployment of applications in cloud and local environments.",
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
      "Development and maintenance of responsive web interfaces.",
      "Design and implementation of REST and GraphQL APIs.",
      "Optimization and management of relational and NoSQL databases.",
      "Automation of deployments and CI/CD with Docker and GitHub Actions.",
      "Analysis and resolution of production incidents.",
      "Implementation of unit and integration tests to improve code quality.",
    ],
    achievements: [
      "Developed new websites and improved the architecture of existing projects.",
      "Migrated and optimized internal services using Nest.js and Node.js, improving backend efficiency by 30%.",
      "Automated the deployment process on both on-premises infrastructure and the cloud (IIS, GCP, AWS, Azure, and Vercel).",
      "Reduced application load times by 40% through asset optimization and database query improvements.",
      "Developed internal tools to improve team productivity.",
    ],
  },
  {
    position: "Web Developer",
    company: "Atlas Global Solutions",
    period: "January 2020 - November 2020",
    location: "Medellín, Colombia",
    description:
      "Responsible for maintaining and customizing WordPress, integrating forms, and providing basic technical support in Salesforce.",
    technologies: ["Salesforce", "HTML", "CSS", "WordPress", "PHP"],
    responsibilities: [
      "Maintaining and updating content in WordPress.",
      "Customizing templates and styling adjustments with HTML and CSS.",
      "Managing and configuring data in Salesforce.",
      "Providing technical support for minor incidents on the platform.",
    ],
    achievements: [
      "Updated forms and improved usability in WordPress.",
      "Optimized styles and design by adjusting HTML and CSS.",
      "Automated basic processes within Salesforce to improve data management.",
      "Developed custom email templates in Salesforce for marketing campaigns.",
      "Implemented unit tests in Salesforce to validate the functionality of custom modules.",
    ],
  },
];

export const educationByLanguage = {
  es: educationES,
  en: educationEN,
};

export const experienceByLanguage = {
  es: experienceES,
  en: experienceEN,
};
