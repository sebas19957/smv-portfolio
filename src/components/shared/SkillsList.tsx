import { Skill } from "@/types/skills";
import { Cloud, Code, Database, Server } from "lucide-react";
import {
  SiAmazonwebservices,
  SiAngular,
  SiDocker,
  SiGithub,
  SiGooglecloud,
  SiGraphql,
  SiJavascript,
  SiJest,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiRedux,
  SiTypescript,
} from "react-icons/si";

type CategoryId = "all" | "frontend" | "backend" | "devops" | "cloud";

export interface SkillWithCategory extends Skill {
  category: string;
}

export const getSkills = (activeCategory: CategoryId): SkillWithCategory[] => {
  const skills: Record<Exclude<CategoryId, "all">, Skill[]> = {
    frontend: [
      {
        name: "React.js",
        icon: <SiReact className="text-[#61DAFB]" />,
        level: 95,
      },
      {
        name: "Next.js",
        icon: <SiNextdotjs className="text-black" />,
        level: 90,
      },
      {
        name: "Angular",
        icon: <SiAngular className="text-[#DD0031]" />,
        level: 75,
      },
      {
        name: "TypeScript",
        icon: <SiTypescript className="text-[#3178C6]" />,
        level: 90,
      },
      {
        name: "JavaScript",
        icon: <SiJavascript className="text-[#F7DF1E]" />,
        level: 95,
      },
      {
        name: "GraphQL",
        icon: <SiGraphql className="text-[#E10098]" />,
        level: 75,
      },
      {
        name: "Redux Toolkit",
        icon: <SiRedux className="text-[#764ABC]" />,
        level: 85,
      },
    ],
    backend: [
      {
        name: "Node.js",
        icon: <SiNodedotjs className="text-[#339933]" />,
        level: 85,
      },
      {
        name: "SQL Server",
        icon: <Database className="text-[#CC2927]" />,
        level: 70,
      },
      {
        name: "MongoDB",
        icon: <SiMongodb className="text-[#47A248]" />,
        level: 75,
      },
      { name: ".NET 8", icon: <Code className="text-[#512BD4]" />, level: 40 },
      {
        name: "Python",
        icon: <SiPython className="text-[#3776AB]" />,
        level: 60,
      },
    ],
    devops: [
      {
        name: "Docker",
        icon: <SiDocker className="text-[#2496ED]" />,
        level: 65,
      },
      { name: "GitHub", icon: <SiGithub className="text-black" />, level: 80 },
      { name: "CI/CD", icon: <SiGithub className="text-black" />, level: 65 },
      { name: "Jest", icon: <SiJest className="text-[#C21325]" />, level: 80 },
      {
        name: "React Testing Library",
        icon: <Code className="text-[#E33332]" />,
        level: 77,
      },
    ],
    cloud: [
      {
        name: "AWS",
        icon: <SiAmazonwebservices className="text-[#232F3E]" />,
        level: 30,
      },
      {
        name: "GCP",
        icon: <SiGooglecloud className="text-[#4285F4]" />,
        level: 30,
      },
      { name: "Azure", icon: <Cloud className="text-[#0078D4]" />, level: 30 },
      { name: "IIS", icon: <Server className="text-[#5E5E5E]" />, level: 80 },
    ],
  };

  // Si la categoría es "all", mostramos todas las categorías
  if (activeCategory === "all") {
    return Object.entries(skills).flatMap(([category, skillList]) =>
      skillList.map((skill) => ({
        ...skill,
        category:
          category === "frontend"
            ? "Frontend"
            : category === "backend"
            ? "Backend"
            : category === "devops"
            ? "DevOps & Testing"
            : "Cloud",
      }))
    );
  }

  // Si hay una categoría activa, retornamos solo los skills de esa categoría
  return skills[activeCategory].map((skill) => ({
    ...skill,
    category:
      activeCategory === "frontend"
        ? "Frontend"
        : activeCategory === "backend"
        ? "Backend"
        : activeCategory === "devops"
        ? "DevOps & Testing"
        : "Cloud",
  }));
};
