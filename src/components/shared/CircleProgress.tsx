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

  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

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
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#ffffff33"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            isInView
              ? {
                  strokeDashoffset:
                    circumference - (percentage / 100) * circumference,
                }
              : {
                  strokeDashoffset: circumference,
                }
          }
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-3xl">
        {icon}
      </div>
    </div>
  );
};

export default CircleProgress;
