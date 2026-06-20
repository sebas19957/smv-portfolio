import { Testimonial } from "@/types/testimonial";

export const testimonialsES: Testimonial[] = [
  {
    id: 1,
    text: "Sebastián es una persona responsable y comprometida con las labores asignadas. Le gustan los retos técnicos y aportar soluciones desde el desarrollo para que el usuario tenga una mejor experiencia. Tiene pensamiento crítico y expresa sus ideas con libertad y convicción. Es muy buen compañero y aporta al crecimiento del equipo de trabajo. Es autodidacta y busca estar actualizado en los temas de su interés y aplica lo aprendido en su trabajo. Agradezco todo su aporte y acompañamiento en el tiempo que compartimos y trabajamos juntos.",
    author: "Paula Andrea Bolivar Uribe",
    role: "Ingeniera de Sistemas / Project Manager / Software Development Lead",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-desktop.webp",
  },
  {
    id: 2,
    text: "Tuve la oportunidad de colaborar con Sebastián en varios proyectos, tanto académicos como laborales. Destacó por su gran conocimiento, compromiso y disposición para aprender y mejorar constantemente. Además, su actitud positiva, resiliencia y compañerismo hicieron que trabajar con él fuera una experiencia muy enriquecedora. Es un profesional invaluable.",
    author: "Diego Fernando Piedrahita Arango",
    role: "Desarrollador backend / Automatizador de procesos",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/me-group-a.png",
  },
  {
    id: 3,
    text: "Sebastián se caracteriza por ser un profesional apasionado por su carrera, siempre está en pro del aprendizaje continuo y en busca de nuevos retos que le permitan crecer profesional y personalmente. Dentro de sus aptitudes están su atención al detalle, la innovación y la colaboración en equipo, adicionalmente, se caracteriza por su lealtad, responsabilidad y compromiso pues son pilares de su personalidad.",
    author: "Vanessa Uribe Echavarría",
    role: "Profesional en administración financiera",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-hellow.webp",
  },
];

export const testimonialsEN: Testimonial[] = [
  {
    id: 1,
    text: "Sebastián is a responsible person committed to the assigned tasks. He likes technical challenges and providing solutions from development so that the user has a better experience. He has critical thinking and expresses his ideas with freedom and conviction. He is a very good colleague and contributes to the growth of the work team. He is self-taught and seeks to be up to date on the topics of his interest and applies what he has learned in his work. I appreciate all your contribution and accompaniment in the time we share and work together.",
    author: "Paula Andrea Bolivar Uribe",
    role: "Systems Engineer / Project Manager / Software Development Lead",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-desktop.webp",
  },
  {
    id: 2,
    text: "I had the opportunity to collaborate with Sebastián on several projects, both academic and professional. He stood out for his great knowledge, commitment, and willingness to learn and continuously improve. Furthermore, his positive attitude, resilience, and teamwork made working with him a very enriching experience. He is an invaluable professional.",
    author: "Diego Fernando Piedrahita Arango",
    role: "Backend Developer / Process Automation Engineer",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-group.webp",
  },
  {
    id: 3,
    text: "Sebastián is characterized as a professional passionate about his career, always focused on continuous learning and seeking new challenges that allow him to grow both professionally and personally. His skills include attention to detail, innovation, and teamwork, in addition to being known for his loyalty, responsibility, and commitment, which are key aspects of his personality.",
    author: "Vanessa Uribe Echavarría",
    role: "Financial Management Professional",
    image:
      "https://personal-smv-assets.s3.sa-east-1.amazonaws.com/avatars/elegant/me-hellow.webp",
  },
];

export const testimonialsByLanguage = {
  es: testimonialsES,
  en: testimonialsEN,
};
