"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const contacts = [
    {
      type: "email",
      label: "EMAIL",
      value: "harsha.yellela@gmail.com",
      href: "mailto:harsha.yellela@gmail.com",
      icon: "📧",
    },
    {
      type: "linkedin",
      label: "LINKEDIN",
      value: "/in/har5ha-7663",
      href: "https://www.linkedin.com/in/har5ha-7663",
      icon: "💼",
    },
    {
      type: "github",
      label: "GITHUB",
      value: "HAR5HA-7663",
      href: "https://github.com/HAR5HA-7663",
      icon: "🐙",
    },
    {
      type: "resume",
      label: "RESUME",
      value: "View / Download",
      href: "/harsha_yellela_resume.pdf",
      icon: "📄",
    },
    {
      type: "location",
      label: "LOCATION",
      value: "United States",
      icon: "📍",
    },
  ];

  return (
    <section id="contact" className="min-h-screen py-20 px-4 relative overflow-hidden">
      {/* Day of the Dead Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {["💀", "🌺", "🌵", "🎸", "🌮"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-4">DÍA DE CONTACTO</h2>
        <p className="text-[#D4A574] font-display text-lg tracking-wider">
          SUMMON THE CODE SLINGER
        </p>
      </motion.div>

      {/* Sugar Skull Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto relative z-10"
      >
        <div className="wanted-poster p-8 text-center">
          {/* Decorative Skull */}
          <motion.div
            animate={{
              rotateZ: [0, -5, 5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-8xl mb-6 inline-block"
            style={{ filter: "drop-shadow(0 0 20px rgba(255, 69, 0, 0.5))" }}
          >
            💀
          </motion.div>

          {/* Marigold Border */}
          <div className="flex justify-center gap-2 mb-8">
            {[...Array(7)].map((_, i) => (
              <motion.span
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                className="text-2xl"
              >
                🌼
              </motion.span>
            ))}
          </div>

          {/* Contact Items */}
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.type}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-center gap-2 sm:gap-4 group"
              >
                <span className="text-2xl sm:text-3xl">{contact.icon}</span>
                <div className="text-left">
                  <p className="text-xs text-[#8B4513] font-display tracking-wider">
                    {contact.label}
                  </p>
                  {contact.href ? (
                    <a
                      href={contact.href}
                      target={contact.type !== "email" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-[#704214] font-display text-sm sm:text-lg hover:text-[#8B0000] transition-colors break-all"
                    >
                      {contact.value}
                    </a>
                  ) : (
                    <p className="text-[#704214] font-display text-sm sm:text-lg">{contact.value}</p>
                  )}
                </div>
                {contact.type === "email" && (
                  <button
                    onClick={() => copyToClipboard(contact.value, contact.type)}
                    className="px-3 py-1 bg-[#8B4513] text-[#FFD700] text-xs font-display hover:bg-[#FF4500] transition-colors"
                  >
                    {copied === contact.type ? "COPIED!" : "COPY"}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#8B4513]" />
            <span className="text-2xl">🌵</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#8B4513]" />
          </div>

          {/* Call to Action */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              href="mailto:harsha.yellela@gmail.com"
              className="inline-block px-8 py-4 bg-gradient-to-b from-[#8B0000] to-[#5C0000] text-[#FFD700] font-display text-xl tracking-widest border-2 border-[#FFD700]"
              style={{
                textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
                boxShadow: "0 0 20px rgba(139, 0, 0, 0.5), inset 0 0 10px rgba(0,0,0,0.3)",
              }}
            >
              SEND A MESSAGE
            </a>
          </motion.div>

          {/* Bottom Decorations */}
          <div className="flex justify-center gap-2 mt-8">
            {["🌺", "🎸", "🌮", "🌶️", "🎺"].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                className="text-2xl"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Candles */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -left-8 bottom-0 text-4xl"
        >
          🕯️
        </motion.div>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="absolute -right-8 bottom-0 text-4xl"
        >
          🕯️
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-20 relative z-10"
      >
        <p className="text-[#8B4513] font-display text-sm">
          CRAFTED WITH 💀 BY THE CODE SLINGER
        </p>
        <p className="text-[#5C2E0A] font-display text-xs mt-2">
          © 2025 HARSHA YELLELA. ALL RIGHTS RESERVED.
        </p>
        <p className="text-[#704214] text-xs mt-4 opacity-50">
          Inspired by Total Overdose (2005)
        </p>
      </motion.footer>
    </section>
  );
}
