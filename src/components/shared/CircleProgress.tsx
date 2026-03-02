import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CircleProgressProps {
  percentage: number;
  size?: number;
  icon: React.ReactNode;
}

const CircleProgress = ({
  percentage,
  size = 80,
  icon,
}: CircleProgressProps) => {
  const [isInView, setIsInView] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const strokeWidth = 4;
  const innerSize = size - strokeWidth * 2;
  const perimeter = (innerSize) * 4;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Fondo del cuadrado */}
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size - strokeWidth}
          height={size - strokeWidth}
          fill="transparent"
          stroke="#ffffff33"
          strokeWidth={strokeWidth}
        />
        {/* Progreso del cuadrado */}
        <motion.rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size - strokeWidth}
          height={size - strokeWidth}
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray={perimeter}
          initial={{ strokeDashoffset: perimeter }}
          animate={
            isInView
              ? {
                  strokeDashoffset:
                    perimeter - (percentage / 100) * perimeter,
                }
              : {
                  strokeDashoffset: perimeter,
                }
          }
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        {icon}
      </div>
    </div>
  );
};

export default CircleProgress;
