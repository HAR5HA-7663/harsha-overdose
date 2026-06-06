// Concept nodes — small atomic ideas that fan out from projects/experiences.
// These massively densify the graph so it reads as a knowledge vault, not a sparse map.

import type { GalaxyNode } from './nodes'

type ConceptInit = {
  id: string
  title: string
  oneLiner: string
  tags: string[]
}

function concept({ id, title, oneLiner, tags }: ConceptInit): GalaxyNode {
  return {
    id: `c-${id}`,
    kind: 'skill',
    title,
    oneLiner,
    tags,
    detail: { kind: 'skill', category: oneLiner },
  }
}

export const CONCEPT_NODES: GalaxyNode[] = [
  // ── teli.ai voice agent fan-out ────────────────────────────────────────
  concept({ id: 'telephony-layer', title: 'Telephony layer', oneLiner: 'PSTN provider · session streaming', tags: ['current', 'voice-agent', 'telephony', 'api'] }),
  concept({ id: 'streaming-tts', title: 'Streaming TTS', oneLiner: 'Voice synthesis · sub-300ms', tags: ['current', 'voice-agent', 'tts', 'ai-ml'] }),
  concept({ id: 'fc-reasoning', title: 'Function-calling reasoning', oneLiner: 'Tool use · structured output', tags: ['current', 'agentic', 'llm', 'voice-agent'] }),
  concept({ id: 'realtime-asr', title: 'Real-time transcription', oneLiner: 'Streaming STT · word-level latency', tags: ['current', 'voice-agent', 'ai-ml'] }),
  concept({ id: 'lead-qualifier', title: 'Lead qualifier agent', oneLiner: 'Mortgage intent classification', tags: ['current', 'mortgage', 'agentic', 'llm'] }),
  concept({ id: 'call-summary', title: 'Call summarization', oneLiner: 'Post-call notes · LO handoff', tags: ['current', 'voice-agent', 'llm', 'mortgage'] }),

  // ── teli.ai SMS fan-out ────────────────────────────────────────────────
  concept({ id: '10dlc', title: '10DLC registration', oneLiner: 'Brand → Campaign → Carrier → Live', tags: ['current', 'mortgage', 'api'] }),
  concept({ id: 'sms-agent', title: 'SMS agentic flows', oneLiner: 'Conversation state · drip nurture', tags: ['current', 'mortgage', 'agentic', 'node'] }),
  concept({ id: 'sms-compliance', title: 'TCPA + carrier filtering', oneLiner: 'Opt-out · STOP/HELP · throttling', tags: ['current', 'mortgage'] }),

  // ── teli.ai email + data fan-out ───────────────────────────────────────
  concept({ id: 'smtp-byod', title: 'SMTP BYOD', oneLiner: 'Loan-officer custom-domain routing', tags: ['current', 'mortgage', 'backend'] }),
  concept({ id: 'multi-tenant', title: 'Row-level isolation', oneLiner: 'Per-LO Postgres tenancy', tags: ['current', 'backend', 'mortgage'] }),
  concept({ id: 'pgvector-rag', title: 'pgvector RAG', oneLiner: 'Call/chat embeddings · cosine retrieval', tags: ['current', 'rag', 'ai-ml', 'mortgage'] }),
  concept({ id: 'langchain-orch', title: 'LangChain orchestration', oneLiner: 'Retrieval + reranking + tool chain', tags: ['current', 'rag', 'agentic', 'ai-ml', 'llm'] }),

  // ── bevri / NEXA clients ───────────────────────────────────────────────
  concept({ id: 'bevri', title: 'bevri.ai', oneLiner: 'URLA/MISMO mortgage automation', tags: ['current', 'mortgage'] }),
  concept({ id: 'nexa', title: 'NEXA Lending', oneLiner: 'Mortgage broker · LO workflows', tags: ['current', 'mortgage'] }),
  concept({ id: 'uwm', title: 'UWM', oneLiner: 'United Wholesale Mortgage · enterprise', tags: ['current', 'mortgage'] }),

  // ── AWS deployment surface (now) ───────────────────────────────────────
  concept({ id: 'aws-ecs', title: 'AWS ECS', oneLiner: 'Container service for voice workers', tags: ['cloud', 'aws', 'current'] }),
  concept({ id: 'aws-eks', title: 'AWS EKS', oneLiner: 'Kubernetes-on-AWS', tags: ['cloud', 'aws', 'kubernetes', 'current'] }),
  concept({ id: 'aws-lambda', title: 'AWS Lambda', oneLiner: 'Serverless function endpoints', tags: ['cloud', 'aws', 'current', 'backend'] }),
  concept({ id: 'gh-actions', title: 'GitHub Actions', oneLiner: 'CI/CD · daily/weekly releases', tags: ['cicd', 'cloud', 'current'] }),
  concept({ id: 'jenkins', title: 'Jenkins', oneLiner: 'Multibranch pipelines', tags: ['cicd', 'current'] }),
  concept({ id: 'docker', title: 'Docker', oneLiner: 'Container packaging', tags: ['cloud', 'docker', 'current'] }),
  concept({ id: 'k8s', title: 'Kubernetes', oneLiner: 'HPA · health · circuit breakers', tags: ['cloud', 'kubernetes', 'current'] }),

  // ── Resume Optimizer fan-out ───────────────────────────────────────────
  concept({ id: 'qlora', title: 'QLoRA', oneLiner: '4-bit NF4 · LoRA rank 16', tags: ['ai-ml', 'finetune', 'llm'] }),
  concept({ id: 'qwen3', title: 'Qwen3-4B', oneLiner: 'Base model · 4B params', tags: ['ai-ml', 'llm'] }),
  concept({ id: 'peft', title: 'PEFT + TRL', oneLiner: 'HuggingFace fine-tuning stack', tags: ['ai-ml', 'finetune', 'llm'] }),
  concept({ id: 'ats-eval', title: 'ATS evaluation', oneLiner: 'GPT-5.1 quality scoring · 9.5/10', tags: ['ai-ml', 'llm'] }),

  // ── ML Sentiment / MLOps fan-out ───────────────────────────────────────
  concept({ id: 'sagemaker', title: 'AWS SageMaker', oneLiner: 'Training · model registry', tags: ['ai-ml', 'cloud', 'aws'] }),
  concept({ id: 'terraform', title: 'Terraform', oneLiner: 'IaC · infra-as-code', tags: ['cloud', 'cicd'] }),
  concept({ id: 'auto-retrain', title: 'Auto-retraining loop', oneLiner: 'Inference→Feedback→Retrain', tags: ['ai-ml', 'cloud', 'microservices'] }),
  concept({ id: 'model-registry', title: 'Model registry', oneLiner: 'Versioned ML artifacts', tags: ['ai-ml', 'cloud'] }),

  // ── Lambda Microservices fan-out ───────────────────────────────────────
  concept({ id: 'stripe', title: 'Stripe Connect', oneLiner: 'Payments · marketplace splits', tags: ['backend', 'api'] }),
  concept({ id: 'twilio-sms', title: 'Twilio SMS', oneLiner: 'Programmable messaging', tags: ['backend', 'api'] }),
  concept({ id: 'docusign', title: 'DocuSign', oneLiner: 'E-signature integration', tags: ['backend', 'api'] }),
  concept({ id: 'quickbooks', title: 'QuickBooks', oneLiner: 'Accounting webhook bridge', tags: ['backend', 'api'] }),
  concept({ id: 'dynamodb', title: 'DynamoDB', oneLiner: 'NoSQL · GSI/LSI indexing', tags: ['backend', 'aws'] }),
  concept({ id: 'apigw', title: 'API Gateway', oneLiner: 'REST + WS · request routing', tags: ['backend', 'api', 'aws'] }),

  // ── FieldFuze fan-out ──────────────────────────────────────────────────
  concept({ id: 'gin', title: 'Gin', oneLiner: 'Go web framework', tags: ['backend', 'go', 'api'] }),
  concept({ id: 'jwt', title: 'JWT auth', oneLiner: 'Token-based access control', tags: ['backend', 'api'] }),
  concept({ id: 'rbac', title: 'Multi-tenant RBAC', oneLiner: 'Role + tenant isolation', tags: ['backend', 'api'] }),

  // ── LuffyGPT fan-out ───────────────────────────────────────────────────
  concept({ id: 'transformer', title: 'Transformer from scratch', oneLiner: 'Multi-head causal self-attention', tags: ['ai-ml', 'llm'] }),
  concept({ id: 'bpe', title: 'BPE tokenizer', oneLiner: 'SentencePiece · 3.11× compression', tags: ['ai-ml', 'llm'] }),
  concept({ id: 'hf-spaces', title: 'HuggingFace Spaces', oneLiner: 'Gradio deploy', tags: ['ai-ml', 'cloud'] }),
  concept({ id: 'multi-gpu', title: 'Multi-GPU DataParallel', oneLiner: 'Dual RTX 3090 training', tags: ['ai-ml'] }),

  // ── CRE Agent fan-out ──────────────────────────────────────────────────
  concept({ id: 'langgraph', title: 'LangGraph', oneLiner: 'Stateful agent graphs', tags: ['agentic', 'rag', 'ai-ml'] }),
  concept({ id: 'qdrant', title: 'Qdrant', oneLiner: 'Vector DB · hybrid retrieval', tags: ['rag', 'ai-ml'] }),
  concept({ id: 'bge-rerank', title: 'BGE cross-encoder', oneLiner: 'Re-ranking retrieved docs', tags: ['rag', 'ai-ml'] }),
  concept({ id: 'bm25', title: 'BM25 sparse retrieval', oneLiner: 'Lexical + semantic fusion', tags: ['rag', 'ai-ml'] }),

  // ── LTU GRA fan-out ────────────────────────────────────────────────────
  concept({ id: 'crewai', title: 'CrewAI', oneLiner: 'Multi-agent orchestration', tags: ['agentic', 'ai-ml', 'rag'] }),
  concept({ id: 'mcp', title: 'MCP', oneLiner: 'Model Context Protocol', tags: ['agentic', 'ai-ml'] }),
  concept({ id: 'opensearch', title: 'OpenSearch Serverless', oneLiner: 'Semantic search · 10K+ docs', tags: ['rag', 'aws', 'cloud'] }),
  concept({ id: 'bedrock', title: 'AWS Bedrock', oneLiner: 'Hosted foundation models', tags: ['ai-ml', 'aws', 'cloud', 'llm'] }),
  concept({ id: 'n8n', title: 'n8n', oneLiner: 'No-code workflow benchmark', tags: ['agentic', 'cicd'] }),

  // ── Infor fan-out ──────────────────────────────────────────────────────
  concept({ id: 'ferrari', title: 'Ferrari ERP', oneLiner: 'Manufacturing integration', tags: ['experience', 'enterprise', 'backend'] }),
  concept({ id: 'boeing', title: 'Boeing ERP', oneLiner: 'Aerospace integration', tags: ['experience', 'enterprise', 'backend'] }),
  concept({ id: 'triumph', title: 'Triumph ERP', oneLiner: 'Manufacturing integration', tags: ['experience', 'enterprise', 'backend'] }),
  concept({ id: 'infor-ion', title: 'Infor ION', oneLiner: 'Event flows · AWS S3/Lambda', tags: ['experience', 'enterprise', 'backend', 'aws'] }),

  // ── Conceptual hubs (these are pure ideas that attract many links) ─────
  concept({ id: 'rag-hub', title: 'RAG', oneLiner: 'Retrieval-augmented generation', tags: ['ai-ml', 'rag', 'llm'] }),
  concept({ id: 'agent-hub', title: 'AI agents', oneLiner: 'Function calling · tool use · multi-agent', tags: ['ai-ml', 'agentic', 'llm', 'voice-agent'] }),
  concept({ id: 'mlops-hub', title: 'MLOps', oneLiner: 'Train · deploy · monitor · retrain', tags: ['ai-ml', 'cloud', 'cicd'] }),
  concept({ id: 'fastapi', title: 'FastAPI', oneLiner: 'Async Python service layer', tags: ['backend', 'python', 'api'] }),
]
