export interface Experience {
  id: number;
  title: string;
  company: string;
  location: string;
  period: string;
  type: "work" | "education";
  bullets: string[];
  icon: string;
}

// Ordered from most recent to oldest for REWIND timeline
export const experiences: Experience[] = [
  {
    id: 0,
    title: "Full Stack Engineer",
    company: "teli.ai",
    location: "Remote, USA",
    period: "Apr 2026 - Present",
    type: "work",
    bullets: [
      "Built voice-calling AI agents with function-calling reasoning on Retell + ElevenLabs for mortgage clients including bevri.ai and NEXA Lending — real-time transcription, summarization, and auto-qualification of leads live in production.",
      "Shipped SMS agentic workflows with 10DLC compliance setup, agent-creation pipeline, and conversation state management in Node.js — live for mortgage broker clients today",
      "Integrated teli.ai voice and SMS agentic capabilities into bevri.ai via REST APIs and Next.js + Node.js services for imminent customer launch",
      "Implemented multi-tenant data isolation in bevri.ai with row-level security on Supabase/PostgreSQL, enabling per-loan-officer workable environments",
      "Engineered RAG pipeline ingesting chat logs and call transcripts into pgvector with LangChain orchestration, exposing retrieval-augmented Q&A so loan officers get instant access to historical context",
      "Built SMTP integration with bring-your-own-domain so loan officers route inbound mortgage leads through their own domains into bevri.ai",
      "Owned end-to-end deployment on AWS (ECS, EKS, Lambda) with Docker, Kubernetes manifests, and GitHub Actions/Jenkins CI/CD — daily/weekly releases at 99%+ uptime",
    ],
    icon: "📞",
  },
  {
    id: 1,
    title: "Software Engineer Research Assistant – Agentic AI",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2025 - Dec 2025",
    type: "work",
    bullets: [
      "Designed multi-agent orchestration systems using CrewAI and LangChain to automate research workflows, reducing manual effort by 70%",
      "Built and deployed 3 persistent AI agent services on AWS EKS with Fargate, supporting semantic search across 10K+ documents with sub-second latency",
      "Developed FastAPI and GraphQL-based backend services integrated with AWS Bedrock for LLM-powered capabilities",
      "Implemented OpenSearch Serverless and Redis caching layers to optimize document retrieval and session management",
      "Automated infrastructure provisioning using Terraform and GitHub Actions CI/CD, reducing provisioning time from 2 hours to 15 minutes",
      "Conducted benchmarking between no-code (n8n) and coded (CrewAI) agent frameworks to guide architectural decisions",
      "Built scalable backend pipelines in Python with asynchronous processing to handle concurrent agent tasks",
    ],
    icon: "🔬",
  },
  {
    id: 2,
    title: "M.S. Computer Science",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2024 - Dec 2025",
    type: "education",
    bullets: [
      "GPA: 3.77/4.0",
      "Focus: AI/ML, Cloud Computing, Distributed Systems",
      "Research: Agentic AI and Multi-Agent Systems",
      "Graduated December 2025",
    ],
    icon: "🎓",
  },
  {
    id: 3,
    title: "Software Engineer — Infor LN CD (Custom Development)",
    company: "Infor India Pvt. Ltd.",
    location: "Hyderabad, India · onsite",
    period: "Apr 2022 - Dec 2023",
    type: "work",
    bullets: [
      "Worked on ERP integration for enterprise clients like Ferrari, Boeing, and Triumph through the Infor LN CD (Custom Development) team — primarily onsite in Hyderabad with extended onsite stints.",
      "Built enterprise-grade RESTful APIs using Java and Spring Boot to integrate Infor LN with external client systems, processing 500+ daily transactions in production.",
      "Engineered serverless microservices using AWS Lambda, API Gateway, and S3 triggers to automate data ingestion and event processing.",
      "Diagnosed and resolved 15+ critical data pipeline issues across MySQL and distributed systems, reducing failure frequency from weekly to monthly.",
      "Built backend services in C++ for performance-critical modules to reduce latency in ERP integrations.",
      "Containerized applications with Docker and implemented CI/CD pipelines, cutting release turnaround by 25%.",
      "Designed frontend components in React.js and JavaScript to improve user interaction with ERP dashboards.",
    ],
    icon: "💼",
  },
  {
    id: 4,
    title: "B.Tech Computer Science",
    company: "Geethanjali College of Engineering",
    location: "Hyderabad, India",
    period: "Aug 2018 - Aug 2022",
    type: "education",
    bullets: [
      "GPA: 7.5/10 (~3.0/4.0 US equivalent)",
      "Focus: Software Engineering, Data Structures, Algorithms",
    ],
    icon: "📚",
  },
];
