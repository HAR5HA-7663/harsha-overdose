"use client";

import { motion } from "framer-motion";
import { useMode } from "../../contexts/ModeContext";
import { certifications } from "../../data/certifications";

export default function Certifications() {
  const { isPro } = useMode();

  if (isPro) {
    return (
      <section id="r-certs" className="py-20 px-4">
        {/* Recruiter mode: clean cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm mb-2 font-medium tracking-widest uppercase" style={{ color: "#818CF8" }}>
            Verified Credentials
          </p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: "#E2E8F0", letterSpacing: "-0.02em" }}>
            Certifications
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl p-6 text-center"
              style={{
                background: "rgba(15, 23, 42, 0.85)",
                border: "1px solid rgba(99, 102, 241, 0.18)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="text-4xl mb-3">{cert.icon}</div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: "#E2E8F0" }}>
                {cert.name}
              </h3>
              <p className="text-sm mb-1" style={{ color: "#94A3B8" }}>
                {cert.issuer}
              </p>
              <p className="text-xs mb-4" style={{ color: "#475569" }}>
                {cert.date}
              </p>
              {cert.verifyUrl && (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-1.5 rounded-lg text-sm font-medium transition-all hover:brightness-110"
                  style={{
                    background: "rgba(99, 102, 241, 0.15)",
                    color: "#818CF8",
                    border: "1px solid rgba(99, 102, 241, 0.3)",
                  }}
                >
                  Verify ↗
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // Artistic mode
  return (
    <section id="certifications" className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-wanted text-4xl md:text-5xl mb-2">CREDENTIALS</h2>
        <p className="text-typewriter text-lg" style={{ color: "#D4A855" }}>
          BADGES OF HONOR
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="wanted-poster p-6 text-center"
          >
            <div className="text-4xl mb-3">{cert.icon}</div>
            <h3 className="text-typewriter text-lg font-bold mb-1" style={{ color: "#5C2E0A" }}>
              {cert.name}
            </h3>
            <p className="text-typewriter text-sm mb-1" style={{ color: "#8B4513" }}>
              {cert.issuer}
            </p>
            <p className="text-typewriter text-xs mb-4" style={{ color: "#704214" }}>
              {cert.date}
            </p>
            {cert.verifyUrl && (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-1.5 rounded text-sm font-bold transition-all hover:brightness-110"
                style={{
                  background: "#8B0000",
                  color: "#FFD700",
                  border: "2px solid #D4A855",
                }}
              >
                VERIFY ↗
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
