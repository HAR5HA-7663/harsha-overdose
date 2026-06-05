// Unified node model for the Latent Space portfolio.
// Every section of the portfolio is a node in 3D space.

export type NodeKind = 'about' | 'skill' | 'project' | 'experience' | 'contact' | 'now'

export type NodeDetail =
  | { kind: 'about'; bio: string[]; resumeUrl: string }
  | { kind: 'skill'; category: string }
  | { kind: 'project'; description: string; tech: string[]; github?: string; live?: string; impact?: string }
  | { kind: 'experience'; company: string; period: string; location: string; bullets: string[]; current?: boolean }
  | { kind: 'contact'; email: string; linkedin: string; github: string; portfolio: string }
  | { kind: 'now'; description: string; clients: string[]; stack: string[]; route: string }

export type GalaxyNode = {
  id: string
  kind: NodeKind
  title: string
  oneLiner: string
  tags: string[]            // semantic tags drive clustering in 3D
  detail: NodeDetail
}

// Tag anchors in 3D space — semantic neighborhoods on a sphere of ~radius 6.
export const TAG_ANCHORS: Record<string, [number, number, number]> = {
  // AI / ML cluster (top)
  'ai-ml':       [ 0.0,  5.5,  1.0],
  llm:           [ 1.5,  4.5,  2.0],
  rag:           [-1.5,  4.5,  2.0],
  'voice-agent': [ 0.0,  4.0,  3.5],
  agentic:       [ 2.0,  4.0,  0.0],
  finetune:      [-2.5,  3.5,  1.0],

  // Backend cluster (right)
  backend:       [ 5.0,  0.0,  0.0],
  api:           [ 4.5, -1.0,  1.0],
  microservices: [ 4.5,  1.0, -1.0],
  go:            [ 5.5, -0.5, -1.5],
  python:        [ 4.0,  1.5,  2.0],
  node:          [ 5.0,  1.5,  0.5],
  java:          [ 4.0, -2.0,  0.5],

  // Cloud / DevOps cluster (bottom-right)
  cloud:         [ 3.0, -4.0,  1.0],
  aws:           [ 4.0, -4.5,  0.0],
  kubernetes:    [ 2.5, -5.0, -1.0],
  cicd:          [ 3.5, -3.5, -2.0],
  docker:        [ 2.0, -4.5,  2.0],

  // Frontend cluster (left)
  frontend:      [-5.0,  1.0,  0.0],
  react:         [-5.0,  2.0,  1.5],
  nextjs:        [-4.5,  0.0,  2.0],
  mobile:        [-5.0, -1.5,  0.0],

  // Experience / time cluster (bottom-left)
  experience:    [-3.0, -4.0,  1.0],
  enterprise:    [-4.0, -4.0,  0.0],
  research:      [-2.0, -4.5,  2.0],

  // Self / contact cluster (back)
  self:          [ 0.0,  0.0, -5.5],
  contact:       [ 0.0, -1.0, -5.5],

  // Current work (front-center, brightest)
  current:       [ 0.0,  1.5,  5.0],
  mortgage:      [-1.0,  1.0,  5.5],
  retell:        [ 1.0,  0.5,  5.5],
  elevenlabs:    [-0.5,  2.0,  5.0],
  openai:        [ 0.5,  2.0,  5.0],
}

// Color palette — Obsidian-style muted groups on warm-dark canvas.
// Skills/projects lean toward electric cyan (the "knowledge cluster" feel from the reference image).
// Hero "now" node is amber-warm to stand out as the call-to-action.
export const KIND_COLORS: Record<NodeKind, string> = {
  about: '#EAB308',       // amber-500 — about/self
  skill: '#67E8F9',       // cyan-300 — knowledge cluster
  project: '#A78BFA',     // violet-400 — built things
  experience: '#34D399',  // emerald-400 — time
  contact: '#FB7185',     // rose-400 — reach out
  now: '#F59E0B',         // amber-500-warm (HERO)
}

function mkSkill(id: string, title: string, category: string, tags: string[]): GalaxyNode {
  return {
    id: `skill-${id}`,
    kind: 'skill',
    title,
    oneLiner: category,
    tags,
    detail: { kind: 'skill', category },
  }
}

// The full set of nodes that populate the galaxy.
export const NODES: GalaxyNode[] = [
  // ===== ABOUT =====
  {
    id: 'about',
    kind: 'about',
    title: 'Harsha Yellela',
    oneLiner: 'Full Stack Engineer who builds AI systems that talk back.',
    tags: ['self'],
    detail: {
      kind: 'about',
      bio: [
        "I'm a Full Stack Engineer at teli.ai building voice and SMS AI agents for the mortgage industry — currently shipping to bevri.ai and NEXA Lending.",
        "Before teli I spent a year at Lawrence Tech building multi-agent systems as a research assistant after finishing my MS in Computer Science (3.77 GPA).",
        "Two years before that I was at Infor in Hyderabad shipping REST API integrations for Ferrari, Boeing, and Triumph. The Ferrari moment is when software stopped being academic for me.",
      ],
      resumeUrl: '/Harsha_Yellela_resume.pdf',
    },
  },

  // ===== NOW (THE TELI NODE — HERO) =====
  {
    id: 'now',
    kind: 'now',
    title: 'Now → teli.ai',
    oneLiner: 'Voice + SMS AI agents for the mortgage industry. Click to enter the call.',
    tags: ['current', 'voice-agent', 'mortgage', 'rag', 'agentic', 'retell', 'elevenlabs', 'openai'],
    detail: {
      kind: 'now',
      description:
        "Full Stack Engineer at teli.ai since April 2026. Building voice + SMS agentic agents using OpenAI GPT-4o function calling for the brain, ElevenLabs for the voice, and Retell as the number provider. We qualify mortgage leads for loan officers at bevri.ai and NEXA Lending.",
      clients: ['bevri.ai', 'NEXA Lending', 'UWM'],
      stack: ['OpenAI GPT-4o', 'ElevenLabs', 'Retell', 'LangChain', 'pgvector', 'Next.js', 'Node.js', 'AWS ECS/EKS/Lambda'],
      route: '/teli',
    },
  },

  // ===== EXPERIENCE =====
  {
    id: 'exp-teli',
    kind: 'experience',
    title: 'teli.ai',
    oneLiner: 'Full Stack Engineer · Apr 2026 → Present',
    tags: ['experience', 'current', 'voice-agent', 'agentic'],
    detail: {
      kind: 'experience',
      company: 'teli.ai',
      period: 'Apr 2026 → Present',
      location: 'Remote, USA',
      current: true,
      bullets: [
        'Built voice calling AI agents with OpenAI GPT-4o function calling, ElevenLabs voice synthesis, and Retell telephony for mortgage clients (bevri.ai, NEXA Lending).',
        'Shipped SMS agentic workflows with full 10DLC compliance registration — live in production today.',
        'Engineered RAG pipeline ingesting chat/call transcripts into pgvector with LangChain orchestration.',
        'Owned end-to-end deployment on AWS (ECS, EKS, Lambda) with Docker, K8s, GitHub Actions/Jenkins CI/CD at 99%+ uptime.',
      ],
    },
  },
  {
    id: 'exp-ltu',
    kind: 'experience',
    title: 'Lawrence Tech (GRA)',
    oneLiner: 'Software Engineer Research Assistant · Agentic AI · Jan 2025 → Dec 2025',
    tags: ['experience', 'research', 'agentic', 'rag', 'ai-ml'],
    detail: {
      kind: 'experience',
      company: 'Lawrence Technological University',
      period: 'Jan 2025 → Dec 2025',
      location: 'Southfield, MI',
      bullets: [
        'Designed multi-agent orchestration systems with CrewAI + LangChain, reducing manual research workflow time by 70%.',
        'Deployed 3 persistent AI agent services on AWS EKS/Fargate with OpenSearch Serverless for semantic search across 10K+ documents.',
        'Cut infrastructure provisioning from 2 hours to 15 minutes via Terraform + GitHub Actions CI/CD.',
        'Benchmarked no-code (n8n) vs coded (CrewAI) agent approaches to inform 2 follow-on research projects.',
      ],
    },
  },
  {
    id: 'exp-infor',
    kind: 'experience',
    title: 'Infor India',
    oneLiner: 'SDE-1 (LN Technical Consultant) · Apr 2022 → Dec 2023',
    tags: ['experience', 'enterprise', 'backend', 'java'],
    detail: {
      kind: 'experience',
      company: 'Infor India Pvt. Ltd.',
      period: 'Apr 2022 → Dec 2023',
      location: 'Hyderabad, India',
      bullets: [
        'Delivered REST API integrations for Ferrari, Boeing, and Triumph processing 500+ daily transactions via AWS Lambda + API Gateway.',
        'Resolved 15+ critical data pipeline issues across MySQL and distributed ERP systems, reducing failure frequency from weekly to monthly.',
        'Containerized business logic with Docker, cut deployment turnaround by 25% via standardized CI workflows.',
      ],
    },
  },

  // ===== PROJECTS =====
  {
    id: 'prj-resume-optimizer',
    kind: 'project',
    title: 'Resume Optimizer',
    oneLiner: 'QLoRA fine-tuned Qwen3-4B for ATS-aware resume generation.',
    tags: ['ai-ml', 'finetune', 'llm', 'python'],
    detail: {
      kind: 'project',
      description:
        'Fine-tuned Qwen3-4B with QLoRA (4-bit NF4, LoRA rank 16, alpha 32) on 1,304 curated examples. 9.5/10 GPT-eval quality at 18-22GB VRAM. FastAPI inference with 3-5s response on RTX 3090.',
      tech: ['PyTorch', 'QLoRA', 'PEFT', 'TRL', 'Transformers', 'FastAPI'],
      github: 'https://github.com/HAR5HA-7663/Resume-Optimzer',
      impact: '9.5/10 GPT eval · 22GB peak VRAM',
    },
  },
  {
    id: 'prj-ml-sentiment',
    kind: 'project',
    title: 'ML Sentiment Loop',
    oneLiner: '8-microservice MLOps platform with auto-retraining.',
    tags: ['ai-ml', 'cloud', 'aws', 'microservices', 'cicd'],
    detail: {
      kind: 'project',
      description:
        '8-microservice MLOps platform with Inference → Feedback → Evaluation → Retraining → Deployment loop. SageMaker triggers, model registry, SNS notifications. Terraform IaC + GitHub Actions to ECS Fargate.',
      tech: ['AWS ECS Fargate', 'SageMaker', 'Terraform', 'GitHub Actions', 'Docker'],
      github: 'https://github.com/HAR5HA-7663/ml-sentiment-feedback-loop',
      impact: '8 services · zero-touch retraining',
    },
  },
  {
    id: 'prj-lambda-microservices',
    kind: 'project',
    title: 'Lambda Microservices',
    oneLiner: '94 AWS Lambda functions for a complete SaaS backend.',
    tags: ['backend', 'cloud', 'aws', 'microservices'],
    detail: {
      kind: 'project',
      description:
        '94 AWS Lambda functions forming a complete SaaS backend with REST and GraphQL APIs via API Gateway. Terraform IaC, integrated Stripe Connect, Twilio, DocuSign, QuickBooks behind a React/Next.js dashboard with React Native mobile app (104+ components).',
      tech: ['Python', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'React', 'Next.js', 'Terraform'],
      github: 'https://github.com/HAR5HA-7663',
      impact: '94 functions · 10+ integrations',
    },
  },
  {
    id: 'prj-fieldfuze',
    kind: 'project',
    title: 'FieldFuze Backend',
    oneLiner: 'Production Go/Gin REST API with multi-tenant RBAC.',
    tags: ['backend', 'go', 'api'],
    detail: {
      kind: 'project',
      description:
        'Production REST API in Go/Gin with multi-tenant RBAC, JWT auth middleware, controller-service-repository architecture, full unit test coverage. Infrastructure automation worker for DynamoDB provisioning.',
      tech: ['Go 1.23', 'Gin', 'DynamoDB', 'JWT', 'Docker', 'GitHub Actions'],
      github: 'https://github.com/HAR5HA-7663/FieldFuze_Backend',
      impact: 'Multi-tenant · full test coverage',
    },
  },
  {
    id: 'prj-luffygpt',
    kind: 'project',
    title: 'LuffyGPT',
    oneLiner: '10.81M-param GPT from scratch in PyTorch.',
    tags: ['ai-ml', 'llm', 'finetune'],
    detail: {
      kind: 'project',
      description:
        'GPT decoder-only transformer from scratch in PyTorch (6 heads, 6 layers, multi-head causal self-attention). Custom BPE tokenizer via SentencePiece (3.11x compression). Trained on dual RTX 3090 GPUs, val loss 1.18 at 25K steps. Deployed on HuggingFace Spaces.',
      tech: ['PyTorch', 'SentencePiece', 'Gradio', 'HuggingFace'],
      github: 'https://github.com/HAR5HA-7663/luffy-gpt',
      live: 'https://huggingface.co/spaces/HAR5HA-YELLELA/luffy-gpt-space',
      impact: 'val loss 1.18 · 10.81M params',
    },
  },
  {
    id: 'prj-cre-agent',
    kind: 'project',
    title: 'CRE Research Agent',
    oneLiner: 'Multi-step RAG pipeline for literature review.',
    tags: ['ai-ml', 'rag', 'agentic'],
    detail: {
      kind: 'project',
      description:
        'Automated literature review with LangGraph state machine: query expansion → retrieval → BGE cross-encoder reranking → summarization. Dual vector DBs (Qdrant + Pinecone) + BM25 sparse retrieval. ~20 relevant papers per query.',
      tech: ['LangGraph', 'FastAPI', 'Qdrant', 'Pinecone', 'Redis'],
      impact: '~20 papers per query',
    },
  },

  // ===== SKILLS =====
  mkSkill('python', 'Python', 'Languages', ['ai-ml', 'python']),
  mkSkill('typescript', 'TypeScript', 'Languages', ['frontend', 'react']),
  mkSkill('go', 'Go', 'Languages', ['backend', 'go']),
  mkSkill('java', 'Java', 'Languages', ['backend', 'java']),
  mkSkill('fastapi', 'FastAPI', 'Backend', ['backend', 'python', 'api']),
  mkSkill('nextjs', 'Next.js', 'Frontend', ['frontend', 'nextjs', 'react']),
  mkSkill('nodejs', 'Node.js', 'Backend', ['backend', 'node']),
  mkSkill('react', 'React', 'Frontend', ['frontend', 'react']),
  mkSkill('aws', 'AWS', 'Cloud', ['cloud', 'aws']),
  mkSkill('kubernetes', 'Kubernetes', 'Cloud', ['cloud', 'kubernetes']),
  mkSkill('docker', 'Docker', 'Cloud', ['cloud', 'docker']),
  mkSkill('terraform', 'Terraform', 'Cloud', ['cloud', 'cicd']),
  mkSkill('langchain', 'LangChain', 'AI/ML', ['ai-ml', 'rag', 'agentic', 'llm']),
  mkSkill('pytorch', 'PyTorch', 'AI/ML', ['ai-ml', 'finetune', 'llm']),
  mkSkill('qlora', 'QLoRA Fine-tuning', 'AI/ML', ['ai-ml', 'finetune', 'llm']),
  mkSkill('pgvector', 'pgvector', 'AI/ML', ['ai-ml', 'rag']),

  // ===== CONTACT =====
  {
    id: 'contact',
    kind: 'contact',
    title: 'Get in touch',
    oneLiner: "Email, LinkedIn, GitHub. I read everything.",
    tags: ['contact', 'self'],
    detail: {
      kind: 'contact',
      email: 'harsha.yellela@gmail.com',
      linkedin: 'https://www.linkedin.com/in/har5ha-7663',
      github: 'https://github.com/HAR5HA-7663',
      portfolio: 'https://har5ha.in',
    },
  },
]
