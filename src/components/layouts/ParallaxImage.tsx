"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  className?: string;
}

export default function ParallaxImage({ className }: Props) {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCoordinates({ x, y });
  };

  const handleMouseLeave = () => {
    setCoordinates({ x: 0, y: 0 });
  };

  return (
    <div
      className={`${className} relative w-full flex items-center justify-center h-[200px]`}
    >
      <div
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Geometric Shapes - Left Side */}
        <div
          className="absolute w-24 h-24 bg-primary/80 -left-20 top-0 z-50 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coordinates.x * 40}px, ${
              coordinates.y * 40
            }px) rotate(${coordinates.x * 20}deg)`,
          }}
        />
        <div
          className="absolute hidden xl:flex w-16 h-16 bg-primary/40 -left-48 top-32 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coordinates.x * 60}px, ${
              coordinates.y * 30
            }px) rotate(${coordinates.y * 30}deg)`,
          }}
        />
        <div
          className="absolute w-20 h-20 bg-primary/90 -left-20 bottom-20 z-50 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coordinates.x * 50}px, ${
              coordinates.y * -40
            }px) rotate(${coordinates.x * -25}deg)`,
          }}
        />

        {/* Geometric Shapes - Right Side */}
        <div
          className="absolute w-32 h-32 bg-primary/50 -right-20 top-5 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coordinates.x * -45}px, ${
              coordinates.y * 35
            }px) rotate(${coordinates.y * -20}deg)`,
          }}
        />
        <div
          className="absolute w-20 h-20 bg-primary/80 -right-28 top-48 transition-transform duration-300 ease-out hidden 2xl:flex"
          style={{
            transform: `translate(${coordinates.x * -55}px, ${
              coordinates.y * 25
            }px) rotate(${coordinates.x * 35}deg)`,
          }}
        />
        <div
          className="absolute w-24 h-24 bg-primary -right-36 bottom-10 transition-transform duration-300 ease-out hidden 2xl:flex"
          style={{
            transform: `translate(${coordinates.x * -40}px, ${
              coordinates.y * -45
            }px) rotate(${coordinates.y * -30}deg)`,
          }}
        />

        {/* Main Image with Enhanced Parallax Effect */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(2000px) 
                       rotateX(${coordinates.y * 15}deg) 
                       rotateY(${coordinates.x * -15}deg) 
                       scale3d(1.1, 1.1, 1.1)`,
          }}
        >
          {/* <Image
            src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/myself_img_3.jpg"
            alt="Parallax Demo Image"
            width={400}
            height={500}
            className="h-auto"
            priority
          /> */}
          <Image
            src="https://personal-smv-assets.s3.sa-east-1.amazonaws.com/imgs/myself_img_3.jpg"
            alt="Parallax Demo Image"
            width={400}
            height={500}
            className="xl:w-[250px] lg:h-[350px] 2xl:w-[400px] 2xl:h-[500px]"
            priority
          />
        </div>

        {/* Additional Floating Elements */}
        <div
          className="absolute w-16 h-16 rounded-full bg-primary/50 -left-16 top-1/3 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${coordinates.x * 30}px, ${
              coordinates.y * 30
            }px)`,
          }}
        />
        <div
          className="absolute w-20 h-20 rounded-full bg-primary/50 -right-12 bottom-1/4 transition-transform duration-300 ease-out "
          style={{
            transform: `translate(${coordinates.x * -30}px, ${
              coordinates.y * -30
            }px)`,
          }}
        />
      </div>
    </div>
  );
}
