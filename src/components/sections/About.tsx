"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function About() {
  const [shotAttempts, setShotAttempts] = useState(0);
  const [showRetaliation, setShowRetaliation] = useState(false);
  const [muzzleFlashes, setMuzzleFlashes] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePhotoClick = (e: React.MouseEvent) => {
    const newAttempts = shotAttempts + 1;
    setShotAttempts(newAttempts);

    // Add muzzle flash at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const flashId = Date.now();
    setMuzzleFlashes(prev => [...prev, { id: flashId, x, y }]);
    setTimeout(() => {
      setMuzzleFlashes(prev => prev.filter(f => f.id !== flashId));
    }, 300);

    // After 3 shots, trigger retaliation
    if (newAttempts >= 3 && !showRetaliation) {
      setShowRetaliation(true);
      setTimeout(() => {
        setShowRetaliation(false);
        setShotAttempts(0);
      }, 4000);
    }
  };

  const retaliationQuotes = [
    "YOU CAN'T KILL THE CODE SLINGER!",
    "NICE TRY, AMIGO!",
    "I'VE SURVIVED WORSE BUGS!",
    "THAT TICKLES!",
    "MY TURN NOW!",
  ];

  const randomQuote = retaliationQuotes[Math.floor(Math.random() * retaliationQuotes.length)];

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

      {/* Retaliation Overlay */}
      <AnimatePresence>
        {showRetaliation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {/* Screen shake effect via background flash */}
            <motion.div
              animate={{
                backgroundColor: ["rgba(139,0,0,0)", "rgba(139,0,0,0.3)", "rgba(139,0,0,0)"],
              }}
              transition={{ duration: 0.1, repeat: 5 }}
              className="absolute inset-0"
            />

            {/* Muzzle flashes shooting back from all directions */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: Math.cos((i / 8) * Math.PI * 2) * 400,
                  y: Math.sin((i / 8) * Math.PI * 2) * 400,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.5, 1, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 100,
                  y: Math.sin((i / 8) * Math.PI * 2) * 100,
                }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  repeat: 3,
                  repeatDelay: 0.2
                }}
                className="absolute text-6xl"
                style={{
                  filter: "drop-shadow(0 0 20px #FF4500)",
                }}
              >
                🔥
              </motion.div>
            ))}

            {/* Gun emoji shooting */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1.5, 1.2],
                rotate: [0, 360, 720],
              }}
              transition={{ duration: 0.8 }}
              className="absolute text-8xl"
              style={{
                filter: "drop-shadow(0 0 30px #FFD700)",
              }}
            >
              🔫
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
              className="absolute top-1/3 text-center px-4"
            >
              <p
                className="text-wanted text-3xl sm:text-5xl md:text-6xl"
                style={{
                  textShadow: "0 0 30px #FF4500, 0 0 60px #8B0000",
                  animation: "pulse 0.5s infinite",
                }}
              >
                {randomQuote}
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-[#FFD700] font-display text-lg mt-4"
              >
                💀 THE CODE SLINGER STRIKES BACK 💀
              </motion.p>
            </motion.div>

            {/* Bullet holes appearing on screen */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`bullet-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="absolute text-2xl"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
              >
                🕳️
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

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
          className="wanted-poster p-4 sm:p-8 md:p-12"
        >
          {/* Confidential Stamp */}
          <div className="absolute top-4 right-4 rotate-12 opacity-60">
            <div className="border-4 border-[#8B0000] text-[#8B0000] font-display text-xl px-4 py-2">
              CLASSIFIED
            </div>
          </div>

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
            {/* Photo - Now Clickable Easter Egg */}
            <motion.div
              onClick={handlePhotoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-40 h-40 bg-[#8B4513] p-2 shadow-lg flex-shrink-0 overflow-hidden cursor-crosshair relative"
              style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.5)" }}
            >
              <div className="w-full h-full relative">
                <Image
                  src="/images/cowboy_headshot.jpg"
                  alt="Harsha Yellela"
                  fill
                  className="object-cover scale-110"
                  style={{ filter: showRetaliation ? "brightness(1.5) contrast(1.2)" : "sepia(20%)" }}
                />

                {/* Muzzle flashes on click */}
                <AnimatePresence>
                  {muzzleFlashes.map((flash) => (
                    <motion.div
                      key={flash.id}
                      initial={{ opacity: 1, scale: 0 }}
                      animate={{ opacity: 0, scale: 2 }}
                      exit={{ opacity: 0 }}
                      className="absolute pointer-events-none"
                      style={{
                        left: flash.x - 15,
                        top: flash.y - 15,
                        filter: "drop-shadow(0 0 10px #FF4500)"
                      }}
                    >
                      <span className="text-3xl">💥</span>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Shot counter hint */}
                {shotAttempts > 0 && shotAttempts < 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className="text-[#FF4500] font-display text-xs">
                      {3 - shotAttempts} more...
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-wanted text-3xl mb-2">HARSHA YELLELA</h3>
              <p className="text-[#704214] font-display text-xl mb-4">
                a.k.a. &quot;THE CODE SLINGER&quot;
              </p>
              <div className="space-y-1 text-typewriter text-[#5C2E0A]">
                <p><span className="text-[#8B4513]">STATUS:</span> M.S. Graduate @Dec 2025 | Seeking Opportunities</p>
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
              Graduated with a <strong>Master&apos;s in Computer Science</strong> from Lawrence
              Technological University (Dec 2025). Worked as a <strong>Graduate Research Assistant</strong>
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
            <div className="flex flex-wrap gap-1 sm:gap-2">
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
                  className="px-2 sm:px-3 py-1 bg-[#8B4513] text-[#F4E4BC] text-xs sm:text-sm font-display"
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
