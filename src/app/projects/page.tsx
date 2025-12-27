"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { allProjects, categories } from "@/data/projects";

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [columns, setColumns] = useState(4);

  // Detect number of columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1024) setColumns(4);
      else if (window.innerWidth >= 768) setColumns(3);
      else setColumns(2);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const filteredProjects = activeCategory === "All"
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory);

  // Find which row the selected project is in (within filtered projects)
  const selectedIndex = filteredProjects.findIndex(p => p.id === selectedProject);
  const selectedRow = selectedIndex >= 0 ? Math.floor(selectedIndex / columns) : -1;

  // Group projects into rows
  const rows: typeof filteredProjects[] = [];
  for (let i = 0; i < filteredProjects.length; i += columns) {
    rows.push(filteredProjects.slice(i, i + columns));
  }

  // Reset selection when category changes
  useEffect(() => {
    setSelectedProject(null);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1A1A1A] via-[#2A1A0A] to-[#1A1A1A] relative overflow-hidden">
      {/* Film Grain Overlay */}
      <div className="film-grain" />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23FFD700'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-6 left-6 z-50"
      >
        <Link
          href="/#projects"
          className="flex items-center gap-2 px-4 py-2 bg-[#8B0000] text-[#FFD700] font-display text-sm border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#8B0000] transition-all duration-300"
        >
          <span className="text-lg">&larr;</span>
          <span>BACK TO BASE</span>
        </Link>
      </motion.div>

      <div className="container mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-wanted text-5xl md:text-7xl mb-4">ALL LOCO MOVES</h1>
          <p className="text-[#D4A574] font-display text-xl tracking-wider mb-2">
            THE COMPLETE ARSENAL OF DESTRUCTION
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-[#FFD700] font-display">🎯</span>
            <span className="text-[#FF4500] font-display text-lg">{allProjects.length} SPECIAL ATTACKS UNLOCKED</span>
            <span className="text-[#FFD700] font-display">🎯</span>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12"
        >
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 sm:px-4 py-1 sm:py-2 font-display text-xs sm:text-sm tracking-wider border-2 transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#8B0000] border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  : "bg-[#2A1A0A] border-[#8B4513] text-[#D4A574] hover:border-[#FFD700] hover:text-[#FFD700]"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </motion.div>

        {/* Projects Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-[#8B4513] font-display text-sm mb-8"
        >
          SHOWING {filteredProjects.length} OF {allProjects.length} LOCO MOVES
        </motion.p>

        {/* Projects Grid with Inline Expansion */}
        <div className="max-w-7xl mx-auto relative z-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {/* Row of project cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {row.map((project, colIndex) => {
                  const globalIndex = rowIndex * columns + colIndex;
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 50, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: globalIndex * 0.03 }}
                      whileHover={{ scale: 1.05, rotateZ: -2 }}
                      onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                      className={`loco-card p-2 sm:p-4 cursor-pointer relative group ${
                        selectedProject === project.id ? "ring-2 ring-[#FFD700]" : ""
                      }`}
                    >
                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="absolute -top-2 -right-2 bg-[#FFD700] text-[#8B0000] text-[8px] sm:text-xs font-display px-2 py-1 rotate-12 z-10">
                          FEATURED
                        </div>
                      )}

                      {/* Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon */}
                      <div className="text-3xl sm:text-5xl text-center mb-2 sm:mb-3 group-hover:animate-float">
                        {project.icon}
                      </div>

                      {/* Loco Move Name */}
                      <h3 className="font-display text-[#FFD700] text-sm sm:text-xl text-center mb-1">
                        {project.locoMove}
                      </h3>

                      {/* Project Name */}
                      <p className="text-[#F4E4BC] text-xs sm:text-sm text-center font-bold mb-2 line-clamp-2">
                        {project.name}
                      </p>

                      {/* Category Tag */}
                      <div className="text-center mb-2">
                        <span className="inline-block px-2 py-0.5 bg-[#2A1A0A] text-[#D4A574] text-[8px] sm:text-[10px] font-display border border-[#8B4513]">
                          {project.category}
                        </span>
                      </div>

                      {/* Damage/Impact */}
                      <div className="text-center">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-[#8B0000] text-[#FFD700] text-[10px] sm:text-xs font-display rounded">
                          {project.damage}
                        </span>
                      </div>

                      {/* Expand Indicator */}
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-center mt-3 text-[#D4A574] text-sm"
                      >
                        {selectedProject === project.id ? "▲" : "▼"}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Expanded Detail Panel - appears right after this row */}
              <AnimatePresence>
                {selectedRow === rowIndex && selectedProject && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    {(() => {
                      const project = filteredProjects.find(p => p.id === selectedProject);
                      if (!project) return null;

                      return (
                        <motion.div
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          className="wanted-poster p-4 sm:p-8 my-4 sm:my-6 relative"
                        >
                          {/* Arrow pointing up to selected card */}
                          <div
                            className="absolute -top-3 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#F4E4BC]"
                            style={{
                              left: `${((selectedIndex % columns) / columns) * 100 + (100 / columns / 2)}%`,
                              transform: "translateX(-50%)",
                            }}
                          />

                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-4 sm:mb-6">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-wanted text-xl sm:text-3xl">{project.name}</h3>
                              <p className="text-[#704214] font-display text-sm sm:text-base">{project.subtitle}</p>
                              <span className="inline-block mt-2 px-2 py-1 bg-[#2A1A0A] text-[#D4A574] text-xs font-display border border-[#8B4513]">
                                {project.category}
                              </span>
                            </div>
                            <span className="text-4xl sm:text-6xl flex-shrink-0">{project.icon}</span>
                          </div>

                          {/* Description */}
                          <p className="text-typewriter text-[#5C2E0A] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                            {project.description}
                          </p>

                          {/* Tech Stack */}
                          <div className="mb-4 sm:mb-6">
                            <p className="text-xs uppercase tracking-wide text-[#8B4513] mb-2">WEAPONS USED:</p>
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {project.tech.map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 sm:px-3 py-1 bg-[#8B4513] text-[#F4E4BC] text-xs sm:text-sm font-display"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Links */}
                          <div className="flex flex-wrap gap-2 sm:gap-4">
                            {project.github && (
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 sm:px-6 py-2 bg-[#1A1A1A] text-[#FFD700] font-display text-sm sm:text-base border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] transition-colors"
                              >
                                VIEW CODE
                              </a>
                            )}
                            {project.live && (
                              <a
                                href={project.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="px-4 sm:px-6 py-2 bg-[#8B0000] text-[#FFD700] font-display text-sm sm:text-base border-2 border-[#8B0000] hover:border-[#FFD700] transition-colors"
                              >
                                LIVE DEMO
                              </a>
                            )}
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 w-8 h-8 bg-[#8B0000] text-[#FFD700] rounded-full font-bold hover:bg-[#FF4500] transition-colors"
                          >
                            x
                          </button>
                        </motion.div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Bottom Decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <div className="flex justify-center gap-4 mb-4">
            {["💀", "🔫", "🌵", "🎸", "🔥"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="text-3xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
          <p className="text-[#8B4513] font-display text-sm">
            CRAFTED WITH BLOOD, SWEAT & CODE
          </p>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10 text-8xl pointer-events-none">🎯</div>
      <div className="absolute bottom-20 right-10 opacity-10 text-8xl pointer-events-none">💀</div>
    </main>
  );
}
