import { Skill } from "@/types/skills";
import { Bot, BrainCircuit, Cloud, Code, Database, Server, Sparkles } from "lucide-react";
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
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedux,
  SiSupabase,
  SiTypescript,
} from "react-icons/si";

type CategoryId = "all" | "frontend" | "backend" | "devops" | "cloud" | "ai";

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
        level: 95,
      },
      {
        name: "Angular",
        icon: <SiAngular className="text-[#DD0031]" />,
        level: 90,
      },
      {
        name: "React Native",
        icon: <SiReact className="text-[#61DAFB]" />,
        level: 90,
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
      {
        name: "PostgreSQL",
        icon: <SiPostgresql className="text-[#4169E1]" />,
        level: 95,
      },
      {
        name: "Supabase",
        icon: <SiSupabase className="text-[#3FCF8E]" />,
        level: 90,
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
        level: 80,
      },
      { name: "GitHub", icon: <SiGithub className="text-black" />, level: 90 },
      { name: "CI/CD", icon: <SiGithub className="text-black" />, level: 80 },
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
        level: 50,
      },
      {
        name: "GCP",
        icon: <SiGooglecloud className="text-[#4285F4]" />,
        level: 30,
      },
      { name: "Azure", icon: <Cloud className="text-[#0078D4]" />, level: 30 },
      { name: "IIS", icon: <Server className="text-[#5E5E5E]" />, level: 80 },
    ],
    ai: [
      {
        name: "Prompt Engineering",
        icon: <Sparkles className="text-[#8B5CF6]" />,
        level: 90,
      },
      {
        name: "LLM Integration",
        icon: <BrainCircuit className="text-[#06B6D4]" />,
        level: 90,
      },
      {
        name: "AI Assistants",
        icon: <Bot className="text-[#10B981]" />,
        level: 90,
      },
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
            : category === "ai"
            ? "AI & ML"
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
        : activeCategory === "ai"
        ? "AI & ML"
        : "Cloud",
  }));
};
