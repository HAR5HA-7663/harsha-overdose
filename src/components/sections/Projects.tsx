"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { featuredProjects, allProjects } from "@/data/projects";
import { useMode } from "@/contexts/ModeContext";

// IDs of the 6 projects shown in Pro mode, in recruiter-recommended order
const PRO_PROJECT_IDS = [4, 11, 2, 3, 5, 8];

// Recruiter-copy for each Pro project
interface ProMeta {
  proName: string;
  problem: string;
  stack: string[];
  outcome: string;
  role: string;
}

const PRO_META: Record<number, ProMeta> = {
  4: {
    proName: "Enterprise Lambda Platform",
    problem: "Serverless backend platform with AWS Lambda + API Gateway for enterprise workflows",
    stack: ["AWS Lambda", "API Gateway", "Python", "DynamoDB", "Terraform"],
    outcome: "94 Lambdas + 10 third-party APIs in production",
    role: "Built and integrated Stripe, Twilio, DocuSign, QuickBooks, and EagleView APIs across 94 functions",
  },
  11: {
    proName: "AI Workflow Automation",
    problem: "Multi-agent workflows to automate complex manual processes (Graduate Research)",
    stack: ["CrewAI", "LangChain", "AWS Fargate", "Amazon EKS", "FastAPI"],
    outcome: "Reduced manual process time by 70%",
    role: "Designed and evaluated no-code (n8n) and code-first (CrewAI + LangChain) multi-agent pipelines",
  },
  2: {
    proName: "Toxicity Detection API",
    problem: "Scalable real-time content moderation service for high-throughput chat streams",
    stack: ["FastAPI", "Kubernetes", "HuggingFace", "Prometheus", "AWS EKS"],
    outcome: "Sustained 500 RPS while reducing infrastructure cost by 70%",
    role: "Designed K8s architecture with HPA, circuit breakers, and Prometheus/Grafana monitoring",
  },
  3: {
    proName: "Feedback Sentiment Platform",
    problem: "Multi-service feedback/sentiment pipeline with continuous model-driven retraining",
    stack: ["AWS SageMaker", "ECS Fargate", "DynamoDB", "FastAPI", "Terraform"],
    outcome: "8 production services with automated model retraining via SNS triggers",
    role: "Architected end-to-end MLOps pipeline: training, deployment, feedback loop, and auto-redeploy",
  },
  5: {
    proName: "FieldFuze Multi-Tenant Backend",
    problem: "Backend services with tenant isolation and role-based access control for field management",
    stack: ["Go", "Gin", "DynamoDB", "JWT", "RBAC", "Docker"],
    outcome: "Secure multi-tenant access with full user lifecycle and real-time sync",
    role: "Designed Go/Gin REST API with JWT auth, DynamoDB GSI/LSI data model, and RBAC middleware",
  },
  8: {
    proName: "CRE Research Agent",
    problem: "Semantic search and retrieval workflows for commercial real-estate research",
    stack: ["LangChain", "Qdrant", "RAG", "FastAPI", "Llama", "PostgreSQL"],
    outcome: "Improved research speed and retrieval relevance across domain queries",
    role: "Built RAG pipeline with vector embeddings, reranking, and ~20 relevant results with inline citations",
  },
};

// Fallback PRO_META for featured projects not in PRO_PROJECT_IDS
const FEATURED_META: Record<number, { problem: string; role: string }> = {
  28: {
    problem: "Real-time cognitive bias detection in the browser before users make bad decisions",
    role: "Built Chrome extension + integrated Claude API for live analysis and reframe suggestions",
  },
  1: {
    problem: "Resume enhancement via a fine-tuned LLM with production-quality output",
    role: "Fine-tuned Qwen3-4B using QLoRA (4-bit NF4), processed 1,800+ resumes, shipped FastAPI service",
  },
  6: {
    problem: "Autonomous robot navigation and object grasping without human intervention",
    role: "Implemented YOLO + CLIP segmentation pipeline with ROS point cloud processing",
  },
};

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [columns, setColumns] = useState(4);
  const { isPro } = useMode();

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

  const selectedIndex = featuredProjects.findIndex(p => p.id === selectedProject);
  const selectedRow = selectedIndex >= 0 ? Math.floor(selectedIndex / columns) : -1;

  const rows: typeof featuredProjects[] = [];
  for (let i = 0; i < featuredProjects.length; i += columns) {
    rows.push(featuredProjects.slice(i, i + columns));
  }

  // Build the 6 pro projects in specified order from allProjects
  const proProjects = PRO_PROJECT_IDS
    .map(id => allProjects.find(p => p.id === id))
    .filter(Boolean) as typeof allProjects;

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
        <h2 className="text-wanted text-4xl md:text-5xl mb-2">LOCO MOVES</h2>
        {isPro ? (
          <p className="text-[#9CA3AF] font-display text-base tracking-wider">
            Projects &nbsp;·&nbsp; <span className="text-[#D4A574]">SPECIAL ATTACKS UNLOCKED</span>
          </p>
        ) : (
          <>
            <p className="text-[#D4A574] font-display text-lg tracking-wider">
              SPECIAL ATTACKS UNLOCKED
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[#FFD700] font-display">⚡</span>
              <span className="text-[#FF4500] font-display text-sm">CLICK TO ACTIVATE</span>
              <span className="text-[#FFD700] font-display">⚡</span>
            </div>
          </>
        )}
      </motion.div>

      <AnimatePresence mode="wait">
        {isPro ? (
          /* ── PRO MODE: 6 curated structured cards ── */
          <motion.div
            key="pro-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >
            {proProjects.map((project, index) => {
              const meta = PRO_META[project.id];
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="rounded-lg p-5 flex flex-col gap-3"
                  style={{
                    background: "rgba(15, 20, 30, 0.85)",
                    border: "1px solid rgba(139, 69, 19, 0.35)",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,168,85,0.5)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(139, 69, 19, 0.35)")}
                >
                  {/* Name + icon */}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{project.icon}</span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[#FFD700] text-base leading-tight">
                        {meta.proName}
                      </h3>
                      <span
                        className="inline-block text-[10px] font-display tracking-wider px-2 py-0.5 rounded mt-1"
                        style={{
                          background: "rgba(139,0,0,0.4)",
                          color: "#D4A574",
                          border: "1px solid rgba(139,0,0,0.6)",
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Problem */}
                  <p className="text-[#C8C8C8] text-sm leading-relaxed">{meta.problem}</p>

                  {/* Stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {meta.stack.map(t => (
                      <span
                        key={t}
                        className="text-[10px] font-display px-2 py-0.5 rounded"
                        style={{
                          background: "rgba(139, 69, 19, 0.3)",
                          color: "#D4A574",
                          border: "1px solid rgba(139, 69, 19, 0.4)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Outcome */}
                  <p className="text-[#D4A855] text-sm font-display flex gap-2 items-start">
                    <span className="flex-shrink-0">◆</span>
                    {meta.outcome}
                  </p>

                  {/* Role */}
                  <p className="text-[#888] text-xs leading-relaxed italic border-l-2 border-[#8B4513]/40 pl-3">
                    {meta.role}
                  </p>

                  {/* Links */}
                  <div className="flex gap-3 mt-auto pt-1">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-display px-3 py-1.5 rounded border transition-colors hover:bg-white/10"
                        style={{ borderColor: "rgba(212,168,85,0.4)", color: "#D4A855" }}
                      >
                        View Code ↗
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-display px-3 py-1.5 rounded border transition-colors hover:bg-white/10"
                        style={{ borderColor: "rgba(139,0,0,0.6)", color: "#FF6B6B" }}
                      >
                        Live Demo ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* ── CREATIVE MODE: Interactive grid with inline expansion ── */
          <motion.div
            key="creative-projects"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto relative z-10 space-y-3 sm:space-y-6"
          >
            {rows.map((row, rowIndex) => (
              <div key={rowIndex}>
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="text-3xl sm:text-5xl text-center mb-2 sm:mb-3 group-hover:animate-float">
                          {project.icon}
                        </div>
                        <h3 className="font-display text-[#FFD700] text-sm sm:text-xl text-center mb-1">
                          {project.locoMove}
                        </h3>
                        <p className="text-[#F4E4BC] text-xs sm:text-sm text-center font-bold mb-2 line-clamp-2">
                          {project.name}
                        </p>
                        <div className="text-center">
                          <span className="inline-block px-2 sm:px-3 py-1 bg-[#8B0000] text-[#FFD700] text-[10px] sm:text-xs font-display rounded">
                            {project.damage}
                          </span>
                        </div>
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

                {/* Expanded Detail Panel */}
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
                        const meta = FEATURED_META[project.id];
                        return (
                          <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="wanted-poster p-4 sm:p-8 my-4 sm:my-6 relative"
                          >
                            <div
                              className="absolute -top-3 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-l-transparent border-r-transparent border-b-[#F4E4BC]"
                              style={{
                                left: `${((selectedIndex % columns) / columns) * 100 + (100 / columns / 2)}%`,
                                transform: "translateX(-50%)",
                              }}
                            />
                            <div className="flex items-start justify-between gap-2 mb-4 sm:mb-6">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-wanted text-xl sm:text-3xl">{project.name}</h3>
                                <p className="text-[#704214] font-display text-sm sm:text-base">{project.subtitle}</p>
                              </div>
                              <span className="text-4xl sm:text-6xl flex-shrink-0">{project.icon}</span>
                            </div>
                            <p className="text-typewriter text-[#5C2E0A] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                              {project.description}
                            </p>
                            {meta && (
                              <p className="text-[#7A4820] text-sm mb-4 italic border-l-2 border-[#8B4513]/50 pl-3">
                                {meta.role}
                              </p>
                            )}
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
          </motion.div>
        )}
      </AnimatePresence>

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
