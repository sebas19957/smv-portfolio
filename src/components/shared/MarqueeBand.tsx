"use client";

import { motion } from "framer-motion";
import { Star, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MarqueeBandProps {
  className?: string;
  variant?: "yellow" | "black";
}

export function MarqueeBand({ className = "", variant = "yellow" }: MarqueeBandProps) {
  const { t } = useLanguage();
  const isYellow = variant === "yellow";

  const items = [
    { text: t("marquee.engineer"), icon: "star" },
    { text: t("marquee.frontend"), icon: "zap" },
    { text: t("marquee.backend"), icon: "star" },
    { text: t("marquee.uiux"), icon: "zap" },
    { text: t("marquee.creative"), icon: "star" },
  ];
  
  const renderIcon = (icon: string) => {
    const iconClass = `w-6 h-6 md:w-10 md:h-10 ${isYellow ? "text-black fill-black" : "text-yellow-400 fill-yellow-400"}`;
    if (icon === "star") return <Star className={iconClass} />;
    if (icon === "zap") return <Zap className={iconClass} />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -3 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`w-screen -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden ${className}`}
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
      }}
    >
      {/* Borde superior blanco */}
      <div className="h-1 bg-white w-full" />
      <div
        className={`${isYellow ? "bg-yellow-400" : "bg-black"} py-3 md:py-4 overflow-hidden`}
      >
        <div className="flex animate-marquee-infinite">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center whitespace-nowrap shrink-0">
              {items.map((item, index) => (
                <div
                  key={`${setIndex}-${index}`}
                  className="flex items-center gap-6 md:gap-8 mx-6 md:mx-10"
                >
                  {renderIcon(item.icon)}
                  <span 
                    className={`font-black text-2xl md:text-4xl lg:text-5xl tracking-wide uppercase ${isYellow ? "text-black" : "text-yellow-400"}`}
                    style={{
                      fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Borde inferior blanco */}
      <div className="h-1 bg-white w-full" />
    </motion.div>
  );
}

export default MarqueeBand;
