"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#04080F",
  surface: "rgba(15, 23, 42, 0.85)",
  surfaceSolid: "#0F172A",
  border: "rgba(99, 102, 241, 0.18)",
  borderHover: "rgba(99, 102, 241, 0.45)",
  accent: "#818CF8",
  gold: "#F59E0B",
  green: "#4ADE80",
  text: "#E2E8F0",
  muted: "#94A3B8",
  dim: "#475569",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SKILLS: Record<string, string[]> = {
  "Core Stack": ["Python", "Go", "Java", "TypeScript", "FastAPI", "Spring Boot", "Gin", "Express.js", "React / Next.js"],
  "Cloud & DevOps": ["AWS Lambda", "ECS / EKS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Prometheus / Grafana"],
  "AI & ML": ["LangChain", "CrewAI", "GPT-4 / Gemini / Claude", "QLoRA Fine-tuning", "RAG + Vector DBs", "SageMaker", "HuggingFace Transformers"],
  "Databases": ["PostgreSQL", "DynamoDB", "Qdrant", "pgvector", "Redis", "MongoDB"],
};

const PROJECTS = [
  {
    id: 1,
    name: "Resumade.in",
    tag: "AI · SaaS · Backend",
    problem: "Manual resume tailoring is slow and misses job-specific keywords.",
    stack: ["FastAPI", "AWS Lambda", "DynamoDB", "GPT-4", "Gemini", "GitHub Actions"],
    outcome: "80% less manual effort · sub-2s PDF generation · 95%+ uptime",
    role: "Sole architect & engineer",
    liveUrl: "https://resumade.in",
  },
  {
    id: 2,
    name: "Lambda Microservices Platform",
    tag: "Serverless · Backend · Integrations",
    problem: "Enterprise SaaS needed 94+ isolated business-logic units with payments, comms, and e-signing.",
    stack: ["AWS Lambda", "API Gateway", "DynamoDB", "Stripe", "Twilio", "DocuSign"],
    outcome: "94 serverless functions · real-time WebRTC calls · end-to-end payment flow",
    role: "Backend engineer",
    liveUrl: null,
  },
  {
    id: 3,
    name: "Telegram Toxicity Moderator",
    tag: "ML · Kubernetes · High Availability",
    problem: "Real-time moderation of high-volume Telegram channels at scale without over-provisioning.",
    stack: ["FastAPI", "Kubernetes / EKS", "HPA", "Prometheus", "Grafana", "PyTorch ML"],
    outcome: "500 RPS avg · 1 500 RPS peak · 70% infra cost reduction via spot instances",
    role: "ML + DevOps engineer",
    liveUrl: null,
  },
  {
    id: 4,
    name: "CRE Research Agent",
    tag: "RAG · Agents · NLP",
    problem: "Literature review across Semantic Scholar + ArXiv is manual and time-consuming.",
    stack: ["LangChain", "Qdrant", "pgvector", "FastAPI", "Semantic Scholar API", "ArXiv API"],
    outcome: "Multi-source retrieval · embeddings + reranking · structured summaries in seconds",
    role: "AI engineer",
    liveUrl: null,
  },
];

const EXPERIENCE = [
  {
    title: "Graduate Research Assistant – Agentic AI",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2025 – Dec 2025",
    type: "Research",
    bullets: [
      "Built and compared no-code (n8n) vs. coded multi-agent systems (CrewAI + LangChain MCP) for workflow automation",
      "Deployed persistent MCP agent services on AWS Fargate / EKS with OpenSearch Serverless Vector Engine for RAG",
      "Designed hybrid pipelines combining Bedrock-hosted models with custom tools — 70% reduction in manual process time",
    ],
  },
  {
    title: "LN Technical Consultant",
    company: "Infor India Pvt. Ltd.",
    location: "Hyderabad, India",
    period: "Apr 2022 – Dec 2023",
    type: "Full-time",
    bullets: [
      "Developed production-ready tools for Ferrari, Boeing, and Triumph via Infor LN ERP workflows",
      "Integrated Infor ION with AWS S3, Lambda, and API Gateway for asynchronous file-transfer pipelines",
      "Containerized services with Docker, reducing batch processing delays by ~40%",
    ],
  },
  {
    title: "Java Backend Apprentice (PEP)",
    company: "EPAM Systems",
    location: "Hyderabad, India",
    period: "Sep 2020 – Jul 2021",
    type: "Apprenticeship",
    bullets: [
      "Completed structured training in Java 8, Spring, REST APIs, and CI/CD fundamentals",
      "Built practice microservices with JUnit testing and Git-based version control",
    ],
  },
];

// ─── Shared card style ────────────────────────────────────────────────────────
const cardStyle: React.CSSProperties = {
  background: C.surface,
  border: `1px solid ${C.border}`,
  backdropFilter: "blur(10px)",
  borderRadius: "12px",
};

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ tag, title }: { tag: string; title: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <p className="text-sm mb-2 font-medium tracking-widest uppercase" style={{ color: C.accent }}>
        {tag}
      </p>
      <h2 className="font-display text-4xl md:text-5xl font-bold" style={{ color: C.text, letterSpacing: "-0.02em" }}>
        {title}
      </h2>
    </motion.div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function RecruiterNav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex justify-center py-3 px-4"
      style={{
        background: "rgba(4, 8, 15, 0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <div className="flex items-center gap-6 md:gap-8">
        {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
          <a
            key={item}
            href={`#r-${item.toLowerCase()}`}
            className="text-sm tracking-wide transition-colors hover:text-indigo-300 hidden sm:block"
            style={{ color: C.muted }}
          >
            {item}
          </a>
        ))}
        <a
          href="https://raw.githubusercontent.com/HAR5HA-7663/resume/main/resumes/Harsha_Yellela_resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
          style={{ background: C.accent, color: "#04080F" }}
        >
          Resume ↓
        </a>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function RecruiterHero() {
  return (
    <section
      id="r-about"
      className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${C.accent}18 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 20%, rgba(99,102,241,0.14) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <span
            className="px-4 py-1.5 rounded-full text-sm font-medium"
            style={{
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: C.green,
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-2 align-middle" />
            Available · F-1 OPT · Open to full-time roles
          </span>
        </motion.div>

        {/* Name + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-6"
        >
          <p className="text-sm mb-3 tracking-widest" style={{ color: C.muted }}>
            HARSHA YELLELA
          </p>
          <h1
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-5"
            style={{ color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            Backend &amp; AI{" "}
            <span
              style={{
                background: `linear-gradient(135deg, ${C.accent} 0%, #C084FC 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Engineer
            </span>
          </h1>
          <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: C.muted }}>
            Building scalable cloud systems, AI-powered workflows, and production APIs.
            <br />
            M.S. Computer Science · Lawrence Technological University.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <a
            href="https://raw.githubusercontent.com/HAR5HA-7663/resume/main/resumes/Harsha_Yellela_resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
            style={{ background: C.accent, color: "#04080F" }}
          >
            ↓ Download Resume
          </a>
          <a
            href="mailto:harsha.yellela@gmail.com"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border: `1px solid ${C.border}`, color: C.text }}
          >
            Email Me
          </a>
          <a
            href="https://www.linkedin.com/in/har5ha-7663"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border: `1px solid ${C.border}`, color: C.text }}
          >
            LinkedIn ↗
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          {[
            { value: "94", label: "Lambda Functions" },
            { value: "70%", label: "Process Time Reduced" },
            { value: "29+", label: "Projects Built" },
            { value: "3 yrs", label: "Professional Exp." },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="p-5 rounded-xl text-center transition-all duration-200"
              style={cardStyle}
            >
              <p className="font-display text-3xl font-bold mb-1" style={{ color: C.accent }}>
                {stat.value}
              </p>
              <p className="text-xs leading-tight" style={{ color: C.muted }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Key achievements row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl grid md:grid-cols-3 gap-5"
          style={cardStyle}
        >
          {[
            { icon: "🏢", text: "Enterprise tools used by Ferrari, Boeing & Triumph at Infor" },
            { icon: "🤖", text: "Multi-agent AI pipelines deployed on AWS Fargate / EKS at LTU" },
            { icon: "☁️", text: "Serverless SaaS (Resumade.in) with sub-2s generation & 95%+ uptime" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                {item.text}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center mt-10 text-xl"
          style={{ color: C.dim }}
        >
          ▼
        </motion.div>
      </div>
    </section>
  );
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function RecruiterSkills() {
  const [active, setActive] = useState("Core Stack");
  const tabs = Object.keys(SKILLS);

  return (
    <section id="r-skills" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeader tag="Technical Skills" title="Tech Stack" />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: active === tab ? C.accent : "transparent",
                color: active === tab ? "#04080F" : C.muted,
                border: `1px solid ${active === tab ? C.accent : C.border}`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {SKILLS[active].map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.06, y: -3 }}
                className="px-5 py-3 rounded-xl text-sm font-medium cursor-default transition-shadow duration-200"
                style={{
                  ...cardStyle,
                  color: C.text,
                }}
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function RecruiterProjects() {
  return (
    <section id="r-projects" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="Selected Work" title="Projects" />

        <div className="grid md:grid-cols-2 gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="p-6 rounded-xl flex flex-col gap-4 transition-all duration-300"
              style={{
                ...cardStyle,
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl font-semibold mb-0.5" style={{ color: C.text }}>
                    {p.name}
                  </h3>
                  <p className="text-xs font-medium tracking-wide" style={{ color: C.accent }}>
                    {p.tag}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {p.liveUrl && (
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
                      style={{ color: C.accent, border: `1px solid ${C.border}` }}
                    >
                      Live ↗
                    </a>
                  )}
                  <a
                    href="https://github.com/HAR5HA-7663"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-2.5 py-1 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: C.muted, border: `1px solid ${C.border}` }}
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>

              {/* Problem */}
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
                {p.problem}
              </p>

              {/* Stack pills */}
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                    style={{ background: "rgba(99,102,241,0.12)", color: C.accent }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Outcome */}
              <div
                className="p-3.5 rounded-xl"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.22)",
                }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: C.gold }}>
                  ◆ Outcome
                </p>
                <p className="text-sm leading-snug" style={{ color: "#FCD34D" }}>
                  {p.outcome}
                </p>
              </div>

              {/* Role */}
              <p className="text-xs italic" style={{ color: C.dim }}>
                Role: {p.role}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="/projects"
            className="inline-block px-6 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
            style={{ border: `1px solid ${C.border}`, color: C.muted }}
          >
            View all 29 projects →
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────
function RecruiterExperience() {
  return (
    <section id="r-experience" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <SectionHeader tag="Career" title="Experience" />

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-[22px] top-3 bottom-16 w-px"
            style={{ background: `linear-gradient(to bottom, ${C.accent}60, transparent)` }}
          />

          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                {/* Dot */}
                <div className="flex-shrink-0 pt-5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: C.accent, boxShadow: `0 0 10px ${C.accent}80` }}
                  />
                </div>

                {/* Card */}
                <div className="flex-1 p-6 rounded-xl" style={cardStyle}>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight" style={{ color: C.text }}>
                        {exp.title}
                      </h3>
                      <p className="text-sm font-medium mt-0.5" style={{ color: C.accent }}>
                        {exp.company}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium" style={{ color: C.muted }}>
                        {exp.period}
                      </p>
                      <p className="text-xs" style={{ color: C.dim }}>
                        {exp.location}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: C.muted }}>
                        <span
                          className="mt-2 w-1 h-1 rounded-full flex-shrink-0"
                          style={{ background: C.accent }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 p-6 rounded-xl"
            style={cardStyle}
          >
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: C.accent }}>
              Education
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  degree: "M.S. Computer Science",
                  school: "Lawrence Technological University",
                  sub: "Southfield, MI",
                  gpa: "3.6 / 4.0",
                  year: "Dec 2025",
                },
                {
                  degree: "B.Tech Computer Science & Engineering",
                  school: "Geethanjali College of Engineering",
                  sub: "Hyderabad, India",
                  gpa: "7.5 / 10",
                  year: "Aug 2022",
                },
              ].map((edu) => (
                <div key={edu.degree}>
                  <p className="font-semibold" style={{ color: C.text }}>
                    {edu.degree}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: C.muted }}>
                    {edu.school}
                  </p>
                  <p className="text-xs mt-1" style={{ color: C.dim }}>
                    GPA: {edu.gpa} · {edu.year}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function RecruiterContact() {
  return (
    <section id="r-contact" className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader tag="Get in Touch" title="Let's Connect" />

          <p className="mb-8 leading-relaxed text-lg" style={{ color: C.muted }}>
            Open to Backend, Cloud, Platform, and AI Engineer roles.
            <br />
            Available immediately · F-1 OPT · Open to relocation
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a
              href="mailto:harsha.yellela@gmail.com"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:brightness-110"
              style={{ background: C.accent, color: "#04080F" }}
            >
              Email Harsha
            </a>
            <a
              href="https://www.linkedin.com/in/har5ha-7663"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
            >
              LinkedIn ↗
            </a>
            <a
              href="https://raw.githubusercontent.com/HAR5HA-7663/resume/main/resumes/Harsha_Yellela_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
              style={{ border: `1px solid ${C.border}`, color: C.text }}
            >
              ↓ Resume
            </a>
          </div>

          {/* Contact details */}
          <div className="p-6 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-5 text-left" style={cardStyle}>
            {[
              { label: "Email", value: "harsha.yellela@gmail.com", href: "mailto:harsha.yellela@gmail.com" },
              { label: "GitHub", value: "HAR5HA-7663", href: "https://github.com/HAR5HA-7663" },
              { label: "LinkedIn", value: "/in/har5ha-7663", href: "https://www.linkedin.com/in/har5ha-7663" },
              { label: "Location", value: "United States (Open to Relocate)", href: null },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs mb-1 font-medium tracking-wide uppercase" style={{ color: C.dim }}>
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                    style={{ color: C.text }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm" style={{ color: C.text }}>
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <p className="text-xs" style={{ color: C.dim }}>
            © 2025 Harsha Yellela · har5ha.in
          </p>
        </motion.footer>
      </div>
    </section>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function RecruiterPage() {
  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <RecruiterNav />
      <RecruiterHero />
      <RecruiterSkills />
      <RecruiterProjects />
      <RecruiterExperience />
      <RecruiterContact />
    </div>
  );
}
