"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { skills, categories } from "@/data/skills";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="min-h-screen py-20 px-4 relative">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-4">ARSENAL</h2>
        <p className="text-[#D4A574] font-display text-lg tracking-wider">
          WEAPONS OF MASS DEVELOPMENT
        </p>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
      >
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 sm:px-4 py-1 sm:py-2 font-display text-xs sm:text-sm tracking-wider border-2 transition-all duration-300 ${
              activeCategory === cat
                ? "bg-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                : "bg-[#2A1A0A] border-[#8B4513] text-[#D4A574] hover:border-[#FFD700] hover:text-[#FFD700]"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </motion.div>

      {/* Skills Grid - Clean Icon Layout */}
      <div className="max-w-5xl mx-auto">
        <motion.div
          layout
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
              >
                {/* Icon Container */}
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl bg-[#F5F5F5]/10 p-3 transition-all duration-300 group-hover:bg-[#F5F5F5]/20 group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                >
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                    unoptimized
                  />
                </div>

                {/* Skill Name */}
                <span className="text-[#D4A574] font-display text-xs sm:text-sm text-center tracking-wide group-hover:text-[#FFD700] transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 text-8xl pointer-events-none">🎯</div>
      <div className="absolute bottom-10 right-10 opacity-10 text-8xl pointer-events-none">💀</div>
    </section>
  );
}
