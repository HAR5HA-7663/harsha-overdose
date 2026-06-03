'use client'

import { motion, AnimatePresence } from 'framer-motion'

type Props = { open: boolean; onClose: () => void }

const STACK_LAYERS = [
  {
    title: 'Edge / Voice',
    items: [
      { name: 'Retell', detail: 'Number provider · inbound + outbound · session-level streaming' },
      { name: 'ElevenLabs', detail: 'Voice synthesis · low-latency streaming TTS' },
      { name: 'OpenAI GPT-4o', detail: 'Brain · function calling · structured output' },
    ],
  },
  {
    title: 'Agent orchestration',
    items: [
      { name: 'Node.js + Next.js', detail: 'Agent control plane · function-call tools' },
      { name: 'Python (FastAPI)', detail: 'LLM/agent services · RAG pipeline' },
      { name: 'LangChain', detail: 'Retrieval + reranking · chain-of-tool orchestration' },
    ],
  },
  {
    title: 'Data + RAG',
    items: [
      { name: 'Supabase + Postgres', detail: 'Multi-tenant data · row-level security per LO/brokerage' },
      { name: 'pgvector', detail: 'Call/chat transcript embeddings · cosine retrieval' },
      { name: 'SMTP (BYOD)', detail: 'Custom-domain routing · loan officers bring their own domain' },
    ],
  },
  {
    title: 'Cloud + DevOps',
    items: [
      { name: 'AWS ECS / EKS / Lambda', detail: 'Voice + SMS workers · function endpoints' },
      { name: 'Docker + Kubernetes', detail: 'Per-service deploys · HPA · health checks' },
      { name: 'GitHub Actions / Jenkins', detail: 'Daily/weekly releases · 99%+ uptime' },
    ],
  },
]

const MODALITIES = [
  { tag: 'VOICE', label: 'GPT-4o + ElevenLabs + Retell', desc: 'inbound + outbound calls, real-time transcription, function-call qualification' },
  { tag: 'SMS', label: '10DLC-compliant agents', desc: 'brand registration through carrier approval — 4,500 segments/day' },
  { tag: 'EMAIL', label: 'SMTP follow-up', desc: 'loan-officer BYOD · templated re-engagement after qualified calls' },
]

export function EngineerMode({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-5xl mx-auto p-8 pt-16"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#FFB347] mb-2">Engineer mode</p>
                <h2 className="text-3xl font-bold text-white">teli.ai · production architecture</h2>
                <p className="text-white/55 mt-2 max-w-2xl text-sm">
                  Three modalities — voice, SMS, email — running on a single agent control plane. All deployed by me end-to-end on AWS.
                </p>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white text-2xl leading-none">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {MODALITIES.map(m => (
                <div key={m.tag} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#FFB347]">{m.tag}</p>
                  <p className="text-white font-semibold text-sm mt-1.5">{m.label}</p>
                  <p className="text-white/55 text-xs mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {STACK_LAYERS.map(layer => (
                <div key={layer.title}>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-2">{layer.title}</p>
                  <div className="space-y-1.5">
                    {layer.items.map(item => (
                      <div key={item.name} className="flex items-start gap-3 text-sm py-1.5 border-b border-white/5">
                        <span className="text-white font-mono w-44 flex-shrink-0">{item.name}</span>
                        <span className="text-white/55">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
              <p className="text-white/40 text-xs">
                shipped daily/weekly · 99%+ uptime · live on bevri.ai and NEXA Lending
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-md text-xs font-semibold tracking-widest uppercase border border-[#FFB347] text-[#FFB347] hover:bg-[#FFB347]/10 transition-colors"
              >
                ← back to the call
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
