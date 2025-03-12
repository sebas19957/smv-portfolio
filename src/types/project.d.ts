export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: "company" | "personal";
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
};
