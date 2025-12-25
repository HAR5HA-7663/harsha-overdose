"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Desert Background Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(212, 168, 85, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(199, 91, 57, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, transparent 0%, rgba(139, 69, 19, 0.1) 100%)
          `,
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-4">THE OUTLAW</h2>
        <p className="text-[#D4A574] font-display text-lg tracking-wider">
          BACKGROUND CHECK
        </p>
      </motion.div>

      {/* Main Content - Dossier Style */}
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, rotateZ: -2 }}
          whileInView={{ opacity: 1, rotateZ: 0 }}
          viewport={{ once: true }}
          className="wanted-poster p-8 md:p-12"
        >
          {/* Confidential Stamp */}
          <div className="absolute top-4 right-4 rotate-12 opacity-60">
            <div className="border-4 border-[#8B0000] text-[#8B0000] font-display text-xl px-4 py-2">
              CLASSIFIED
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            {/* Photo */}
            <div className="w-40 h-40 bg-[#8B4513] p-2 shadow-lg flex-shrink-0 overflow-hidden" style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}>
              <div className="w-full h-full relative">
                <Image
                  src="/images/cowboy_headshot.jpg"
                  alt="Harsha Vardhan Yellela"
                  fill
                  className="object-cover"
                  style={{ filter: "sepia(20%)" }}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-wanted text-3xl mb-2">HARSHA VARDHAN YELLELA</h3>
              <p className="text-[#704214] font-display text-xl mb-4">
                a.k.a. &quot;THE CODE SLINGER&quot;
              </p>
              <div className="space-y-1 text-typewriter text-[#5C2E0A]">
                <p><span className="text-[#8B4513]">STATUS:</span> Recent M.S. Graduate | Seeking Opportunities</p>
                <p><span className="text-[#8B4513]">LOCATION:</span> United States (Open to Relocation)</p>
                <p><span className="text-[#8B4513]">ORIGIN:</span> Hyderabad, India</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513] to-transparent" />
            <span className="text-2xl">🔱</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513] to-transparent" />
          </div>

          {/* Bio */}
          <div className="space-y-4 text-typewriter text-[#5C2E0A] leading-relaxed">
            <p>
              <span className="text-[#8B0000] font-display text-lg">WANTED</span> for building
              scalable backend systems, deploying AI/ML models to production, and orchestrating
              cloud infrastructure that just works.
            </p>
            <p>
              Recently graduated with a <strong>Master&apos;s in Computer Science</strong> from Lawrence
              Technological University (Dec 2024). Worked as a <strong>Graduate Research Assistant</strong>
              focused on Agentic AI and multi-agent systems.
            </p>
            <p>
              Previously rode with <strong>Infor</strong> as a Technical Consultant, developing
              enterprise tools for global clients including <strong>Ferrari, Boeing, and Triumph</strong>.
            </p>
            <p>
              <span className="text-[#8B0000] font-display">Now seeking</span> Backend, DevOps, ML/AI,
              or Cloud Engineering roles to bring my skills to your posse.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "YEARS CODING", value: "5+", icon: "⌨️" },
              { label: "PROJECTS", value: "27+", icon: "🎯" },
              { label: "LAMBDAS DEPLOYED", value: "94", icon: "⚡" },
              { label: "COFFEES", value: "∞", icon: "☕" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-[#2A1A0A]/50 border border-[#8B4513]"
              >
                <span className="text-2xl">{stat.icon}</span>
                <p className="font-display text-2xl text-[#FFD700] mt-1">{stat.value}</p>
                <p className="text-xs text-[#8B4513] font-display tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Specializations */}
          <div className="mt-8">
            <p className="text-sm text-[#8B4513] font-display tracking-wider mb-3">KNOWN FOR:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Backend Engineering",
                "Cloud Architecture",
                "AI/ML Systems",
                "DevOps & CI/CD",
                "Kubernetes",
                "LLM Integration",
                "API Design",
                "Serverless",
              ].map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1 bg-[#8B4513] text-[#F4E4BC] text-sm font-display"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-4 left-4 opacity-30 text-6xl">🌵</div>
          <div className="absolute top-1/2 -right-2 opacity-30 text-4xl">🎸</div>
        </motion.div>
      </div>
    </section>
  );
}
