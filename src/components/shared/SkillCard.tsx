import CircleProgress from "./CircleProgress";
import { SkillWithCategory } from "./SkillsList";

interface SkillCardProps {
  skill: SkillWithCategory;
}

const SkillCard = ({ skill }: SkillCardProps) => {
  const { name, icon, level, category } = skill;

  return (
    <div className="flex flex-col items-center text-center text-black">
      <CircleProgress percentage={level} icon={icon} />
      <h3 className="mt-2 font-bold text-sm">{name}</h3>
      <p className="text-xs opacity-75">{category}</p>
      <p className="font-bold mt-1 text-xs">{level}%</p>
    </div>
  );
};

export default SkillCard;
