"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { experiences } from "@/data/experience";

export default function Experience() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRewinding, setIsRewinding] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handleRewind = (index: number) => {
    if (index < currentIndex) {
      setIsRewinding(true);
      setTimeout(() => setIsRewinding(false), 500);
    }
    setCurrentIndex(index);
  };

  const currentExp = experiences[currentIndex];

  return (
    <section id="experience" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* VHS Static Effect when Rewinding */}
      {isRewinding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0.8, 0] }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.1) 0px,
              rgba(255, 255, 255, 0.1) 1px,
              transparent 1px,
              transparent 2px
            )`,
          }}
        />
      )}

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-4">REWIND</h2>
        <p className="text-[#D4A574] font-display text-lg tracking-wider">
          TRAVEL THROUGH TIME
        </p>
      </motion.div>

      {/* Rewind Slider */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-12"
      >
        <div className="relative">
          {/* Timeline Track */}
          <div className="h-4 bg-[#2A1A0A] border-2 border-[#8B4513] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8B0000] via-[#FF4500] to-[#FFD700]"
              style={{
                width: `${((experiences.length - 1 - currentIndex) / (experiences.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Timeline Markers */}
          <div className="absolute inset-0 flex justify-between items-center px-2">
            {experiences.map((exp, index) => (
              <button
                key={exp.id}
                onClick={() => handleRewind(index)}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300 z-10 ${
                  index === currentIndex
                    ? "bg-[#FFD700] border-[#FFD700] scale-125 shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                    : index < currentIndex
                    ? "bg-[#8B0000] border-[#8B0000]"
                    : "bg-[#2A1A0A] border-[#8B4513] hover:border-[#FFD700]"
                }`}
              />
            ))}
          </div>

          {/* Year Labels */}
          <div className="flex justify-between mt-4 px-1">
            {experiences.map((exp) => (
              <span key={exp.id} className="text-xs text-[#D4A574] font-display">
                {exp.period.split(" - ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Rewind Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => currentIndex < experiences.length - 1 && handleRewind(currentIndex + 1)}
            disabled={currentIndex >= experiences.length - 1}
            className="px-4 py-2 bg-[#8B4513] text-[#FFD700] font-display disabled:opacity-30 hover:bg-[#FF4500] transition-colors"
          >
            ⏪ REWIND
          </button>
          <button
            onClick={() => currentIndex > 0 && handleRewind(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="px-4 py-2 bg-[#8B4513] text-[#FFD700] font-display disabled:opacity-30 hover:bg-[#FF4500] transition-colors"
          >
            FORWARD ⏩
          </button>
        </div>
      </motion.div>

      {/* Experience Card */}
      <motion.div
        key={currentExp.id}
        initial={{ opacity: 0, x: isRewinding ? 100 : -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div
          className="wanted-poster p-8 relative"
          style={{
            transform: `rotate(${currentIndex % 2 === 0 ? -1 : 1}deg)`,
          }}
        >
          {/* Type Badge */}
          <div className="absolute -top-3 -right-3 px-4 py-1 bg-[#8B0000] text-[#FFD700] font-display text-sm rotate-12">
            {currentExp.type === "work" ? "MISSION" : "TRAINING"}
          </div>

          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <span className="text-5xl">{currentExp.icon}</span>
            <div className="flex-1">
              <h3 className="text-wanted text-2xl md:text-3xl">{currentExp.title}</h3>
              <p className="text-[#704214] font-display text-lg">{currentExp.company}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#8B4513]">
                <span>📍 {currentExp.location}</span>
                <span>📅 {currentExp.period}</span>
              </div>
            </div>
          </div>

          {/* Bullets */}
          <div className="space-y-3">
            {currentExp.bullets.map((bullet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <span className="text-[#8B0000] mt-1">🔸</span>
                <p className="text-typewriter text-[#5C2E0A]">{bullet}</p>
              </motion.div>
            ))}
          </div>

          {/* Film Reel Decoration */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-5 bg-[#1A1A1A] rounded-sm" />
            ))}
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-50">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-5 bg-[#1A1A1A] rounded-sm" />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Decorative VHS Text */}
      <div className="absolute bottom-4 left-4 text-[#8B0000] font-display text-sm opacity-50">
        REC ● {currentExp.period}
      </div>
      <div className="absolute bottom-4 right-4 text-[#8B0000] font-display text-sm opacity-50">
        {String(experiences.length - currentIndex).padStart(2, "0")}/{String(experiences.length).padStart(2, "0")}
      </div>
    </section>
  );
}
