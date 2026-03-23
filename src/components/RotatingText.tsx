"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  titles?: string[];
  className?: string;
}

const RotatingText = ({ titles = [], className }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % titles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [titles]);

  return (
    <div className={`${className} flex  h-20`}>
      <AnimatePresence mode="wait">
        <motion.h2
          key={titles[index]}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-3xl md:text-4xl lg:text-4xl font-black mb-8"
          style={{
            fontFamily: "var(--font-barlow-condensed), 'Barlow Condensed', sans-serif",
          }}
        >
          {titles[index].split(" ").map((word, i) => (
            <span
              key={i}
              style={
                i === 0
                  ? {
                      WebkitTextStroke: "1.5px #facc15",
                      WebkitTextFillColor: "transparent",
                    }
                  : undefined
              }
              className={i === 0 ? "" : "text-yellow-400"}
            >
              {word}{" "}
            </span>
          ))}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;
