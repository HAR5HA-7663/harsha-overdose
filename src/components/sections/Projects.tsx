"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { featuredProjects, allProjects } from "@/data/projects";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
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

  // Find which row the selected project is in
  const selectedIndex = featuredProjects.findIndex(p => p.id === selectedProject);
  const selectedRow = selectedIndex >= 0 ? Math.floor(selectedIndex / columns) : -1;

  // Group projects into rows
  const rows: typeof featuredProjects[] = [];
  for (let i = 0; i < featuredProjects.length; i += columns) {
    rows.push(featuredProjects.slice(i, i + columns));
  }

  return (
    <section id="projects" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23FFD700'/%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-4">LOCO MOVES</h2>
        <p className="text-[#D4A574] font-display text-lg tracking-wider">
          SPECIAL ATTACKS UNLOCKED
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[#FFD700] font-display">⚡</span>
          <span className="text-[#FF4500] font-display text-sm">CLICK TO ACTIVATE</span>
          <span className="text-[#FFD700] font-display">⚡</span>
        </div>
      </motion.div>

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
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: globalIndex * 0.1 }}
                    whileHover={{ scale: 1.05, rotateZ: -2 }}
                    onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
                    className={`loco-card p-2 sm:p-4 cursor-pointer relative group ${
                      selectedProject === project.id ? "ring-2 ring-[#FFD700]" : ""
                    }`}
                  >
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
                    const project = featuredProjects.find(p => p.id === selectedProject);
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

      {/* View All Projects Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12 relative z-10"
      >
        <Link href="/projects">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-b from-[#8B0000] to-[#5C0000] text-[#FFD700] font-display text-xl tracking-widest border-2 border-[#FFD700] relative overflow-hidden group"
            style={{
              textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
              boxShadow: "0 0 20px rgba(139, 0, 0, 0.5), inset 0 0 10px rgba(0,0,0,0.3)",
            }}
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <span>🎯</span>
              <span>VIEW ALL {allProjects.length} LOCO MOVES</span>
              <span>🎯</span>
            </span>
          </motion.button>
        </Link>
        <p className="text-[#8B4513] font-display text-sm mt-3">
          UNLOCK THE COMPLETE ARSENAL
        </p>
      </motion.div>
    </section>
  );
}
