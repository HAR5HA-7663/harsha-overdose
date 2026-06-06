'use client'

import { AnimatePresence, motion } from 'framer-motion'

type Props = { open: boolean; onClose: () => void }

const STACK_LAYERS = [
  {
    title: 'Edge / Voice',
    items: [
      { name: 'Telephony layer', detail: 'PSTN provider · inbound + outbound · session-level streaming' },
      { name: 'Streaming TTS', detail: 'low-latency voice synthesis · sub-300ms' },
      { name: 'Reasoning model', detail: 'brain · function calling · structured-output tool schemas' },
    ],
  },
  {
    title: 'Agent orchestration',
    items: [
      { name: 'Node.js + Next.js', detail: 'agent control plane · function-call tools' },
      { name: 'Python (FastAPI)', detail: 'LLM/agent services · RAG pipeline' },
      { name: 'LangChain', detail: 'retrieval + reranking · chain-of-tool orchestration' },
    ],
  },
  {
    title: 'Data + RAG',
    items: [
      { name: 'Supabase + Postgres', detail: 'multi-tenant data · row-level security per LO/brokerage' },
      { name: 'pgvector', detail: 'call/chat transcript embeddings · cosine retrieval' },
      { name: 'SMTP (BYOD)', detail: 'custom-domain routing · loan officers bring their own domain' },
    ],
  },
  {
    title: 'Cloud + DevOps',
    items: [
      { name: 'AWS ECS / EKS / Lambda', detail: 'voice + SMS workers · function endpoints' },
      { name: 'Docker + Kubernetes', detail: 'per-service deploys · HPA · health checks' },
      { name: 'GitHub Actions / Jenkins', detail: 'daily/weekly releases · 99%+ uptime' },
    ],
  },
]

const MODALITIES = [
  { tag: 'VOICE', label: 'Reasoning model + streaming TTS + telephony', desc: 'inbound + outbound calls, real-time transcription, function-call qualification' },
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
          className="fixed inset-0 z-40 overflow-y-auto"
          style={{ background: 'rgba(14, 12, 10, 0.92)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="max-w-5xl mx-auto p-7 pt-16"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-7">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B] mb-2">Engineer mode</p>
                <h2 className="text-[28px] font-medium text-[var(--ink)] tracking-[-0.02em]">teli.ai · production architecture</h2>
                <p className="text-[var(--body)] mt-2 max-w-2xl text-[14px] leading-[1.55]">
                  Three modalities — voice, SMS, email — running on a single agent control plane. All deployed by me end-to-end on AWS.
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-[var(--mute)] hover:text-[var(--ink)] text-[18px] px-2 py-1 rounded-[3px] hover:bg-[var(--canvas-soft)]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
              {MODALITIES.map(m => (
                <div
                  key={m.tag}
                  className="rounded-[4px] p-4"
                  style={{ background: 'var(--canvas-soft)', border: '1px solid var(--hairline)' }}
                >
                  <p className="mono text-[10px] uppercase tracking-[0.25em] text-[#F59E0B]">{m.tag}</p>
                  <p className="text-[var(--ink)] font-medium text-[14px] mt-1.5 tracking-[-0.01em]">{m.label}</p>
                  <p className="text-[var(--body)] text-[12px] mt-1.5 leading-[1.5]">{m.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {STACK_LAYERS.map(layer => (
                <div key={layer.title}>
                  <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--mute)] mb-2">{layer.title}</p>
                  <div className="space-y-0.5">
                    {layer.items.map(item => (
                      <div
                        key={item.name}
                        className="flex items-start gap-3 text-[13px] py-2"
                        style={{ borderBottom: '1px solid var(--hairline)' }}
                      >
                        <span className="mono text-[var(--ink)] w-48 flex-shrink-0">{item.name}</span>
                        <span className="text-[var(--body)]">{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-5 flex items-center justify-between" style={{ borderTop: '1px solid var(--hairline)' }}>
              <p className="text-[var(--mute)] text-[12px]">
                shipped daily/weekly · 99%+ uptime · live on bevri.ai and NEXA Lending
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-[3px] mono text-[11px] tracking-[0.2em] uppercase transition-colors"
                style={{ border: '1px solid #F59E0B', color: '#F59E0B' }}
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
