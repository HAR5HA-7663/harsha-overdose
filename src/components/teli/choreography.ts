// 45-second choreography for the Sarah Chen refi call.
// Each beat advances the scene state.

export type Beat = {
  time: number            // seconds from call start
  phase: 'ringing' | 'borrower' | 'thinking' | 'tool-call' | 'rag' | 'agent' | 'qualified' | 'idle'
  speaker?: 'sarah' | 'agent'
  caption?: string        // subtitle text
  emit?: string           // event name for side panels (sms-sent, email-sent, tool-fired, rag-hit)
}

export const BEATS: Beat[] = [
  { time: 0.0,  phase: 'ringing', caption: 'Incoming call · NEXA Lending lead · Sarah Chen · Michigan' },
  { time: 3.0,  phase: 'ringing', caption: '◐ Connecting via Retell …' },
  { time: 5.0,  phase: 'borrower', speaker: 'sarah', caption: '"Hi, I saw your ad on Facebook — I want to refinance my mortgage."' },
  { time: 9.5,  phase: 'thinking', caption: 'agent.think("classify intent")' },
  { time: 11.0, phase: 'thinking', caption: '→ intent = refinance_inquiry · confidence 0.94' },
  { time: 13.5, phase: 'tool-call', caption: 'tools.get_loan_eligibility({ home_value: 340000, current_rate: 7.5, term: 30 })', emit: 'tool-fired' },
  { time: 16.5, phase: 'rag', caption: 'pgvector.search("Sarah Chen prior interactions, credit summary, intent history")', emit: 'rag-hit' },
  { time: 19.5, phase: 'rag', caption: '← 4 chunks retrieved · prior call notes · credit pull from 11/2025' },
  { time: 22.0, phase: 'agent', speaker: 'agent', caption: '"Sarah, based on your numbers, refinancing 30→15 year saves roughly $84K over the loan."' },
  { time: 27.5, phase: 'agent', speaker: 'agent', caption: '"I can hand you off to Jonathan, your loan officer at NEXA — got 2 minutes?"' },
  { time: 31.5, phase: 'borrower', speaker: 'sarah', caption: '"Yes, please connect me."' },
  { time: 33.5, phase: 'qualified', caption: '✓ LEAD_QUALIFIED · routing to LO Jonathan Haddad · NEXA', emit: 'sms-sent' },
  { time: 36.5, phase: 'qualified', caption: '✓ SMS sent · 10DLC compliant · confirmation #4521', emit: 'email-sent' },
  { time: 39.0, phase: 'qualified', caption: '✓ Follow-up email queued · loan-officer hand-off complete' },
  { time: 42.0, phase: 'idle',     caption: 'Call ended · 41s · all systems nominal' },
  { time: 45.0, phase: 'ringing',  caption: '↻ Restarting cinematic …' },
]

export const TOTAL_DURATION = 46

export function getCurrentBeat(elapsed: number): Beat {
  const t = elapsed % TOTAL_DURATION
  let active = BEATS[0]
  for (const b of BEATS) {
    if (b.time <= t) active = b
    else break
  }
  return active
}
