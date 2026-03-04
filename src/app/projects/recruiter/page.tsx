"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { allProjects, categories } from "@/data/projects";

const C = {
  bg: "#04080F",
  surface: "rgba(15, 23, 42, 0.85)",
  border: "rgba(99, 102, 241, 0.18)",
  borderHover: "rgba(99, 102, 241, 0.45)",
  accent: "#818CF8",
  gold: "#F59E0B",
  text: "#E2E8F0",
  muted: "#94A3B8",
  dim: "#475569",
};

const cardStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
};

export default function RecruiterProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);

  // Apply recruiter-mode cursor + font (same as RecruiterPage)
  useEffect(() => {
    document.body.classList.add("recruiter-mode");
    return () => document.body.classList.remove("recruiter-mode");
  }, []);

  const filtered =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((p) => p.category === activeCategory);

  const selectedProject = allProjects.find((p) => p.id === selected) ?? null;

  return (
    <main
      className="min-h-screen relative"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${C.accent}15 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
            style={{ color: C.muted }}
          >
            ← Back to Portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p
            className="text-sm font-medium tracking-widest uppercase mb-2"
            style={{ color: C.accent }}
          >
            Selected Work
          </p>
          <h1
            className="font-display text-4xl md:text-5xl font-bold mb-3"
            style={{ color: C.text, letterSpacing: "-0.02em" }}
          >
            All Projects
          </h1>
          <p style={{ color: C.muted }}>
            {allProjects.length} projects · click any card to expand
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelected(null);
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: activeCategory === cat ? C.accent : "transparent",
                color: activeCategory === cat ? "#04080F" : C.muted,
                border: `1px solid ${activeCategory === cat ? C.accent : C.border}`,
              }}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Count */}
        <p className="text-xs mb-6" style={{ color: C.dim }}>
          Showing {filtered.length} of {allProjects.length}
        </p>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03 }}
                onClick={() =>
                  setSelected(selected === project.id ? null : project.id)
                }
                whileHover={{ y: -4 }}
                className="p-5 rounded-xl cursor-pointer transition-all duration-200 relative"
                style={{
                  ...cardStyle,
                  border: `1px solid ${
                    selected === project.id ? C.accent : C.border
                  }`,
                  boxShadow:
                    selected === project.id
                      ? `0 0 0 1px ${C.accent}, 0 8px 32px rgba(0,0,0,0.4)`
                      : "none",
                }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      color: C.accent,
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    Featured
                  </span>
                )}

                {/* Icon + name */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{project.icon}</span>
                  <div>
                    <h3
                      className="font-semibold leading-tight"
                      style={{ color: C.text }}
                    >
                      {project.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                      {project.subtitle}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <span
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{
                    background: "rgba(99,102,241,0.1)",
                    color: C.accent,
                  }}
                >
                  {project.category}
                </span>

                {/* Impact */}
                <div className="mt-3">
                  <span
                    className="text-xs px-2 py-1 rounded-md"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      color: C.gold,
                      border: "1px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    ◆ {project.damage}
                  </span>
                </div>

                {/* Expand indicator */}
                <p
                  className="text-xs mt-3"
                  style={{ color: C.dim }}
                >
                  {selected === project.id ? "▲ collapse" : "▼ expand"}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Expanded detail drawer */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto"
            style={{
              background: "rgba(9, 14, 26, 0.98)",
              borderTop: `1px solid ${C.accent}40`,
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{selectedProject.icon}</span>
                  <div>
                    <h2
                      className="font-display text-2xl font-bold"
                      style={{ color: C.text }}
                    >
                      {selectedProject.name}
                    </h2>
                    <p className="text-sm mt-0.5" style={{ color: C.muted }}>
                      {selectedProject.subtitle}
                    </p>
                    <span
                      className="inline-block mt-1 text-xs px-2 py-0.5 rounded-md"
                      style={{
                        background: "rgba(99,102,241,0.12)",
                        color: C.accent,
                      }}
                    >
                      {selectedProject.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ color: C.muted, border: `1px solid ${C.border}` }}
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: C.muted }}
              >
                {selectedProject.description}
              </p>

              {/* Stack */}
              <div className="mb-5">
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: C.dim }}
                >
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg text-xs font-medium"
                      style={{
                        background: "rgba(99,102,241,0.1)",
                        color: C.accent,
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Outcome */}
              <div
                className="p-4 rounded-xl mb-5"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.22)",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: C.gold }}
                >
                  ◆ Impact / Outcome
                </p>
                <p className="text-sm" style={{ color: "#FCD34D" }}>
                  {selectedProject.damage}
                </p>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {selectedProject.github && (
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
                    style={{ background: C.accent, color: "#04080F" }}
                  >
                    GitHub ↗
                  </a>
                )}
                {selectedProject.live && (
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
                    style={{
                      border: `1px solid ${C.border}`,
                      color: C.text,
                    }}
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
