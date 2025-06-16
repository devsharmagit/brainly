"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Globe,
  Notebook,
  Twitter,
  Youtube,
} from "lucide-react";

export function RandomFloatingIcons() {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
console.log(dimensions)
  useEffect(() => {
    // Update dimensions only on client side
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Icons array
  const icons = [
    { icon: Globe, color: "text-blue-400/70" },
    { icon: Youtube, color: "text-red-400/70" },
    { icon: Twitter, color: "text-sky-400/70" },
    { icon: Notebook, color: "text-green-400/70" },
    { icon: FileText, color: "text-amber-400/70" },
    { icon: Brain, color: "text-purple-400/70" },
  ];

  // Generate random positions for each icon

  const possibleXValues = [0.12, 0.22, 0.45, 0.67, 0.78, 0.89]; // Predefined x values

  const iconPositions = possibleXValues.map((x) => ({
    x: x * 0.8 + 0.1,
    y: Math.random() * 0.1 , // Random y between 10 and 20
  }));

  return (
    <>
      {iconPositions.map((position, i) => {
        const IconComponent = icons[i % icons.length].icon;
        const iconColor = icons[i % icons.length].color;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${position.x * 100}%`,
              top: `${position.y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              y: [0, -15, 0, -8, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              repeatType: "mirror",
            }}
          >
            <div className="w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
              <IconComponent className={`w-8 h-8 ${iconColor}`} />
            </div>
          </motion.div>
        );
      })}
    </>
  );
}
