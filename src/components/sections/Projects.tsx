"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

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

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, rotateZ: -2 }}
            onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
            className="loco-card p-4 cursor-pointer relative group"
          >
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon */}
            <div className="text-5xl text-center mb-3 group-hover:animate-float">
              {project.icon}
            </div>

            {/* Loco Move Name */}
            <h3 className="font-display text-[#FFD700] text-xl text-center mb-1">
              {project.locoMove}
            </h3>

            {/* Project Name */}
            <p className="text-[#F4E4BC] text-sm text-center font-bold mb-2">
              {project.name}
            </p>

            {/* Damage/Impact */}
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-[#8B0000] text-[#FFD700] text-xs font-display rounded">
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
        ))}
      </div>

      {/* Expanded Project Detail */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-4xl mx-auto mt-8 relative z-10"
          >
            {(() => {
              const project = projects.find(p => p.id === selectedProject);
              if (!project) return null;

              return (
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="wanted-poster p-8"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-wanted text-3xl">{project.name}</h3>
                      <p className="text-[#704214] font-display">{project.subtitle}</p>
                    </div>
                    <span className="text-6xl">{project.icon}</span>
                  </div>

                  {/* Description */}
                  <p className="text-typewriter text-[#5C2E0A] mb-6 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-wide text-[#8B4513] mb-2">WEAPONS USED:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-[#8B4513] text-[#F4E4BC] text-sm font-display"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-6 py-2 bg-[#1A1A1A] text-[#FFD700] font-display border-2 border-[#FFD700] hover:bg-[#FFD700] hover:text-[#1A1A1A] transition-colors"
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
                        className="px-6 py-2 bg-[#8B0000] text-[#FFD700] font-display border-2 border-[#8B0000] hover:border-[#FFD700] transition-colors"
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
                    ×
                  </button>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
