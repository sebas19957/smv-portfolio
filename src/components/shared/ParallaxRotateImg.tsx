"use client";

import Image from "next/image";
import React, { useState } from "react";

const ParallaxRotateImg = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // Rango: -1 a 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // Rango: -1 a 1
    setCoordinates({ x, y });
  };

  const handleMouseLeave = () => {
    setCoordinates({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className="relative cursor-pointer w-[350px] h-[350px] perspective-[1000px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fondo con efecto de profundidad y rotación */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: isHovered
              ? `rotateX(${coordinates.y * 15}deg) rotateY(${
                  coordinates.x * 15
                }deg) 
                 translate(${coordinates.x * 10}px, ${coordinates.y * 10}px) 
                 scale(1.05)`
              : "rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)",
          }}
        >
          <Image
            src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/bg.jpg"
            alt="Background Image"
            layout="fill"
            sizes="350px"
            className="object-cover"
            priority
          />
        </div>

        {/* Imagen principal con efecto flotante en la dirección opuesta */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden transition-transform duration-300 ease-out"
          style={{
            transform: isHovered
              ? `rotateX(${coordinates.y * -12}deg) rotateY(${
                  coordinates.x * -12
                }deg) 
                 translate(${coordinates.x * -20}px, ${coordinates.y * -20}px) 
                 scale(1.1)`
              : "rotateX(0deg) rotateY(0deg) translate(0px, 0px) scale(1)",
          }}
        >
          <Image
            src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/me.png"
            alt="Main Image"
            layout="fill"
            sizes="350px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default ParallaxRotateImg;
