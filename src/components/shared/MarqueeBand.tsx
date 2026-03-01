"use client";

import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";

interface MarqueeBandProps {
  className?: string;
  variant?: "yellow" | "black";
}

const items = [
  { text: "FRONTEND DEVELOPER", icon: "star" },
  { text: "UI/UX ENTHUSIAST", icon: "zap" },
  { text: "CREATIVE", icon: "star" },
  { text: "REACT SPECIALIST", icon: "zap" },
];

export function MarqueeBand({ className = "", variant = "yellow" }: MarqueeBandProps) {
  const isYellow = variant === "yellow";
  
  const renderIcon = (icon: string) => {
    const iconClass = `w-6 h-6 md:w-10 md:h-10 ${isYellow ? "text-black fill-black" : "text-yellow-400 fill-yellow-400"}`;
    if (icon === "star") return <Star className={iconClass} />;
    if (icon === "zap") return <Zap className={iconClass} />;
    return null;
  };

  const repeatedItems = [...items, ...items, ...items, ...items, ...items, ...items];

  return (
    <div
      className={`w-screen -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden ${className}`}
      style={{
        transform: "rotate(-3deg)",
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Borde superior blanco */}
      <div className="h-1 bg-white w-full" />
      <div
        className={`${isYellow ? "bg-yellow-400" : "bg-black"} py-3 md:py-4`}
      >
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {repeatedItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6 md:gap-8 mx-6 md:mx-10"
            >
              {renderIcon(item.icon)}
              <span className={`font-black text-2xl md:text-4xl lg:text-5xl tracking-wide uppercase ${isYellow ? "text-black" : "text-yellow-400"}`}>
                {item.text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      {/* Borde inferior blanco */}
      <div className="h-1 bg-white w-full" />
    </div>
  );
}

export default MarqueeBand;
