"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, categories } from "@/data/skills";

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

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

      {/* Category Filter - Ammo Belt Style */}
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

      {/* Skills Grid - Combo Meter Style */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={() => setHoveredSkill(skill.name)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="relative bg-gradient-to-b from-[#2A1A0A] to-[#1A1A1A] border-2 border-[#8B4513] p-4 group"
              style={{
                boxShadow: hoveredSkill === skill.name
                  ? "0 0 20px rgba(255, 69, 0, 0.4), inset 0 0 15px rgba(139, 69, 19, 0.3)"
                  : "inset 0 0 15px rgba(0,0,0,0.5)",
              }}
            >
              {/* Skill Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{skill.icon}</span>
                <div className="flex-1">
                  <h3 className="font-display text-[#FFD700] text-lg">{skill.name}</h3>
                  <p className="text-xs text-[#8B4513] uppercase tracking-wider">{skill.category}</p>
                </div>
                <span className="font-display text-[#FF4500] text-xl">{skill.level}%</span>
              </div>

              {/* Combo Meter Bar */}
              <div className="relative h-4 bg-[#1A1A1A] border border-[#5C2E0A] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-full relative"
                  style={{
                    background: `linear-gradient(90deg,
                      #8B0000 0%,
                      #FF4500 ${skill.level < 50 ? '100%' : '50%'},
                      #FFD700 100%
                    )`,
                    boxShadow: "0 0 10px rgba(255, 69, 0, 0.5)",
                  }}
                >
                  {/* Animated pulse on high skills */}
                  {skill.level >= 85 && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    />
                  )}
                </motion.div>

                {/* Meter Marks */}
                <div className="absolute inset-0 flex">
                  {[25, 50, 75].map((mark) => (
                    <div
                      key={mark}
                      className="absolute top-0 bottom-0 w-px bg-[#5C2E0A]"
                      style={{ left: `${mark}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Skill Level Label */}
              <div className="mt-2 text-right">
                <span className={`text-xs font-display tracking-wider ${
                  skill.level >= 90 ? "text-[#FFD700]" :
                  skill.level >= 75 ? "text-[#FF4500]" :
                  skill.level >= 50 ? "text-[#D4A574]" :
                  "text-[#8B4513]"
                }`}>
                  {skill.level >= 90 ? "LEGENDARY" :
                   skill.level >= 75 ? "VETERAN" :
                   skill.level >= 50 ? "SKILLED" :
                   "NOVICE"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 text-8xl">🎯</div>
      <div className="absolute bottom-10 right-10 opacity-10 text-8xl">💀</div>
    </section>
  );
}
