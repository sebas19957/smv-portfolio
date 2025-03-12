import { Skills } from "@/types/skills";

export const skills: Skills[] = [
  // Frontend
  { name: "React.js", percentage: 95, category: "Frontend" },
  { name: "Next.js", percentage: 90, category: "Frontend" },
  { name: "TypeScript", percentage: 90, category: "Frontend" },
  { name: "JavaScript", percentage: 95, category: "Frontend" },
  { name: "GraphQL", percentage: 75, category: "Frontend" },
  { name: "Redux Toolkit", percentage: 85, category: "Frontend" },

  // Backend
  { name: "Node.js", percentage: 85, category: "Backend" },
  { name: "Nest.js", percentage: 85, category: "Backend" },
  { name: "SQL Server", percentage: 70, category: "Backend" },
  { name: "MongoDB", percentage: 75, category: "Backend" },
  { name: ".NET 8", percentage: 40, category: "Backend" },
  { name: "Python", percentage: 65, category: "Backend" },

  // DevOps & Testing
  { name: "Docker", percentage: 65, category: "DevOps & Testing" },
  { name: "GitHub", percentage: 85, category: "DevOps & Testing" },
  { name: "CI/CD", percentage: 65, category: "DevOps & Testing" },
  { name: "Jest", percentage: 80, category: "DevOps & Testing" },
  {
    name: "React Testing Library",
    percentage: 77,
    category: "DevOps & Testing",
  },

  // Cloud
  { name: "AWS", percentage: 30, category: "Cloud" },
  { name: "GCP", percentage: 40, category: "Cloud" },
  { name: "Azure", percentage: 30, category: "Cloud" },
  { name: "IIS", percentage: 80, category: "Cloud" },
];
