"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import { useGunshot, useComboSound, useSoundToggle } from "@/hooks/useSound";

interface BulletHole {
  id: number;
  x: number;
  y: number;
}

interface MuzzleFlash {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const [bulletHoles, setBulletHoles] = useState<BulletHole[]>([]);
  const [muzzleFlashes, setMuzzleFlashes] = useState<MuzzleFlash[]>([]);
  const [showContent, setShowContent] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showHero, setShowHero] = useState(true);

  const { isMuted, toggle: toggleMute } = useSoundToggle();
  const gunshot = useGunshot();
  const comboSound = useComboSound();

  // Sync mute state with sound hooks
  useEffect(() => {
    gunshot.setIsMuted(isMuted);
    comboSound.setIsMuted(isMuted);
  }, [isMuted, gunshot, comboSound]);

  // Reset combo after 2 seconds of inactivity
  useEffect(() => {
    if (comboCount > 0) {
      const timer = setTimeout(() => setComboCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [comboCount, lastClickTime]);

  // Show content after initial animation
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Only add bullet holes in hero section
    if (!showHero) return;

    const newHole: BulletHole = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };

    const newFlash: MuzzleFlash = {
      id: Date.now() + 1,
      x: e.clientX,
      y: e.clientY,
    };

    setBulletHoles((prev) => [...prev, newHole]);
    setMuzzleFlashes((prev) => [...prev, newFlash]);

    const newCombo = comboCount + 1;
    setComboCount(newCombo);
    setLastClickTime(Date.now());

    // Play sounds
    gunshot.play();
    if (newCombo > 1) {
      comboSound.play(newCombo);
    }

    // Remove muzzle flash after animation
    setTimeout(() => {
      setMuzzleFlashes((prev) => prev.filter((f) => f.id !== newFlash.id));
    }, 100);

    // Limit bullet holes to prevent performance issues
    if (bulletHoles.length > 20) {
      setBulletHoles((prev) => prev.slice(-15));
    }
  }, [bulletHoles.length, comboCount, showHero, gunshot, comboSound]);

  // Track scroll position for hero section
  useEffect(() => {
    const handleScroll = () => {
      setShowHero(window.scrollY < window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Fixed Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 100%, rgba(139, 69, 19, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(199, 91, 57, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 20% 30%, rgba(212, 168, 85, 0.15) 0%, transparent 40%),
            linear-gradient(180deg, #1A1A1A 0%, #2A1A0A 50%, #1A1A1A 100%)
          `,
        }}
      />

      {/* Bullet Holes (only in hero) */}
      <AnimatePresence>
        {bulletHoles.map((hole) => (
          <motion.div
            key={hole.id}
            className="bullet-hole fixed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              left: hole.x - 10,
              top: hole.y - 10,
              zIndex: 9997,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Muzzle Flashes */}
      <AnimatePresence>
        {muzzleFlashes.map((flash) => (
          <motion.div
            key={flash.id}
            className="muzzle-flash"
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            style={{
              left: flash.x - 50,
              top: flash.y - 50,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Combo Counter */}
      <AnimatePresence>
        {comboCount > 1 && (
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed top-20 right-8 z-[9999]"
          >
            <div className="combo-bar px-6 py-3 rounded-lg">
              <span className="font-display text-2xl text-[#1A1A1A] font-bold">
                {comboCount}x COMBO!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sound Toggle - fixed in corner */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
        }}
        className="fixed top-4 right-4 z-[9999] p-3 rounded-full text-2xl hover:scale-110 transition-transform"
        style={{
          background: "rgba(26, 26, 26, 0.8)",
          border: "1px solid rgba(139, 69, 19, 0.5)",
        }}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? "🔇" : "🔊"}
      </motion.button>

      {/* Navigation - only show after scrolling past hero */}
      <AnimatePresence>
        {!showHero && (
          <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 p-4 flex justify-center items-center z-[9998]"
          >
            <div
              className="flex items-center gap-8 px-6 py-3 rounded-full"
              style={{
                background: "rgba(26, 26, 26, 0.95)",
                border: "1px solid rgba(139, 69, 19, 0.5)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
              }}
            >
              {["ABOUT", "SKILLS", "PROJECTS", "EXPERIENCE", "CONTACT"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-display text-[#FFD700] hover:text-white transition-colors tracking-wider"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        className="min-h-screen flex flex-col items-center justify-center p-4 relative"
        onClick={handleClick}
      >
        {/* Main Wanted Poster */}
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateZ: -5 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="wanted-poster w-full max-w-2xl p-8 md:p-12 relative z-10"
            >
              {/* Torn Edge Top */}
              <div
                className="absolute -top-2 left-0 right-0 h-4"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0 10 10 Q15 0 20 10 Q25 0 30 10 Q35 0 40 10 Q45 0 50 10 Q55 0 60 10 Q65 0 70 10 Q75 0 80 10 Q85 0 90 10 Q95 0 100 10' fill='%23F4E4BC'/%3E%3C/svg%3E") repeat-x`,
                }}
              />

              {/* Wanted Header */}
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-wanted text-4xl md:text-6xl text-center mb-4"
              >
                WANTED
              </motion.h1>

              {/* Dead or Alive */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-[#704214] font-display text-lg tracking-widest mb-6"
              >
                DEAD OR ALIVE
              </motion.p>

              {/* Photo Frame */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative mx-auto w-48 h-48 md:w-64 md:h-64 mb-6 bg-[#8B4513] p-2 shadow-lg"
                style={{
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3)",
                }}
              >
                <div className="w-full h-full bg-[#2A2A2A] relative overflow-hidden">
                  <Image
                    src="/images/cowboy_headshot.jpg"
                    alt="Harsha Vardhan Yellela - The Code Slinger"
                    fill
                    className="object-cover"
                    style={{ filter: "sepia(30%) contrast(1.1)" }}
                    priority
                  />
                  <div className="absolute inset-0 bg-[#704214] mix-blend-overlay opacity-20" />
                </div>
              </motion.div>

              {/* Name */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-wanted text-2xl md:text-4xl text-center mb-2"
              >
                HARSHA VARDHAN
              </motion.h2>

              {/* Alias */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center text-[#704214] font-display text-xl mb-6"
              >
                a.k.a. &quot;THE CODE SLINGER&quot;
              </motion.p>

              {/* Crimes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-typewriter text-center mb-6 space-y-1"
              >
                <p className="text-sm uppercase tracking-wide text-[#8B4513]">Wanted For:</p>
                <p className="text-[#704214]">Backend Engineering • Cloud Architecture</p>
                <p className="text-[#704214]">AI/ML Sorcery • DevOps Mayhem</p>
              </motion.div>

              {/* Reward */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-sm uppercase tracking-wide text-[#8B4513] mb-1">Reward</p>
                <p className="font-display text-3xl md:text-4xl text-[#8B0000] flex items-center justify-center gap-1">
                  <Image src="/images/beli.webp" alt="Beli" width={32} height={32} className="inline-block" />
                  3,000,000,000
                </p>
              </motion.div>

              {/* Decorative Corner Stamps */}
              <div className="absolute top-4 left-4 w-16 h-16 opacity-30 rotate-[-15deg]">
                <div className="text-[#8B0000] font-display text-xs text-center border-2 border-[#8B0000] rounded-full w-full h-full flex items-center justify-center">
                  CERTIFIED<br />DANGEROUS
                </div>
              </div>

              {/* Torn Edge Bottom */}
              <div
                className="absolute -bottom-2 left-0 right-0 h-4 rotate-180"
                style={{
                  background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q5 0 10 10 Q15 0 20 10 Q25 0 30 10 Q35 0 40 10 Q45 0 50 10 Q55 0 60 10 Q65 0 70 10 Q75 0 80 10 Q85 0 90 10 Q95 0 100 10' fill='%23F4E4BC'/%3E%3C/svg%3E") repeat-x`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter Button */}
        <AnimatePresence>
          {showContent && (
            <motion.a
              href="#about"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-8 py-4 bg-gradient-to-b from-[#8B4513] to-[#5C2E0A] text-[#FFD700] font-display text-xl tracking-widest border-2 border-[#FFD700] rounded shadow-lg relative z-10"
              style={{
                textShadow: "0 0 10px rgba(255,215,0,0.5)",
                boxShadow: "0 0 20px rgba(139,69,19,0.5), inset 0 0 10px rgba(0,0,0,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              ENTER LOS TOROS
            </motion.a>
          )}
        </AnimatePresence>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-6 text-[#FFD700] text-2xl z-10"
        >
          ▼
        </motion.div>
      </section>

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills />

      {/* Projects Section */}
      <Projects />

      {/* Experience Section */}
      <Experience />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
