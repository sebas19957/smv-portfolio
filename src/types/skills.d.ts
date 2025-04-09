export type Skills = {
  name: string;
  percentage: number;
  category: string;
};

export type Skill = {
  name: string;
  icon: ReactNode;
  level: number;
};

export type Category = {
  id: CategoryId;
  name: string;
};
