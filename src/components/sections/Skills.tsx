"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { skills, categories } from "@/data/skills";
import { useMode } from "@/contexts/ModeContext";

const CORE_STACK = [
  "Python", "Go", "TypeScript",
  "AWS", "Kubernetes", "Docker", "Terraform",
  "FastAPI", "PostgreSQL",
  "PyTorch", "GitHub Actions", "Redis",
];

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { isPro } = useMode();

  const filteredSkills = activeCategory === "All"
    ? skills
    : skills.filter(s => s.category === activeCategory);

  const coreSkills = skills.filter(s => CORE_STACK.includes(s.name));
  const workingSkills = skills.filter(s => !CORE_STACK.includes(s.name));

  return (
    <section id="skills" className="min-h-screen py-20 px-4 relative">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-2">ARSENAL</h2>
        {isPro ? (
          <p className="text-[#9CA3AF] font-display text-base tracking-wider">
            Skills &nbsp;·&nbsp; <span className="text-[#D4A574]">WEAPONS OF MASS DEVELOPMENT</span>
          </p>
        ) : (
          <p className="text-[#D4A574] font-display text-lg tracking-wider">
            WEAPONS OF MASS DEVELOPMENT
          </p>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isPro ? (
          /* ── PRO MODE: Core Stack + Working Knowledge tiers ── */
          <motion.div
            key="pro-skills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto space-y-12"
          >
            {/* Core Stack */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D4A855]/40" />
                <span className="font-display text-[#D4A855] text-sm tracking-widest px-3 py-1 border border-[#D4A855]/40 rounded">
                  CORE STACK
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D4A855]/40" />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 gap-4 md:gap-6">
                {coreSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl p-3 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,168,85,0.4)]"
                      style={{
                        background: "rgba(212,168,85,0.1)",
                        border: "1px solid rgba(212,168,85,0.3)",
                      }}
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
                    <span className="text-[#D4A574] font-display text-xs sm:text-sm text-center tracking-wide group-hover:text-[#FFD700] transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Working Knowledge */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#8B4513]/40" />
                <span className="font-display text-[#8B4513] text-sm tracking-widest px-3 py-1 border border-[#8B4513]/40 rounded">
                  WORKING KNOWLEDGE
                </span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#8B4513]/40" />
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
                {workingSkills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.1 }}
                    className="flex flex-col items-center gap-1.5 group cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg p-2 transition-all duration-300 group-hover:bg-white/10"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={32}
                        height={32}
                        className="w-7 h-7 sm:w-8 sm:h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                        unoptimized
                      />
                    </div>
                    <span className="text-[#8B7355] font-display text-[10px] text-center group-hover:text-[#D4A574] transition-colors">
                      {skill.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── CREATIVE MODE: Full icon wall with category filter ── */
          <motion.div
            key="creative-skills"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Filter */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
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

            {/* Skills Grid */}
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
                      <span className="text-[#D4A574] font-display text-xs sm:text-sm text-center tracking-wide group-hover:text-[#FFD700] transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-10 text-8xl pointer-events-none">🎯</div>
      <div className="absolute bottom-10 right-10 opacity-10 text-8xl pointer-events-none">💀</div>
    </section>
  );
}
