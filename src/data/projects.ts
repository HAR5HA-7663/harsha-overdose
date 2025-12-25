export interface Project {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  locoMove: string; // Special attack name
  damage: string; // Impact/result
  icon: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "RESUME OPTIMIZER",
    subtitle: "QLoRA Fine-Tuning",
    description: "Fine-tuned Qwen3-4B using QLoRA with 4-bit NF4 quantization for resume enhancement. Achieved 9.5/10 quality scores with 18-22GB GPU memory.",
    tech: ["PyTorch", "Transformers", "QLoRA", "PEFT", "Qwen3"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "BRAIN BLAST",
    damage: "9.5/10 Quality Score",
    icon: "🧠",
  },
  {
    id: 2,
    name: "TELEGRAM TOXICITY",
    subtitle: "K8s ML Platform",
    description: "Kubernetes-based ML platform handling 500 RPS with circuit breakers, HPA scaling, and Prometheus monitoring. 70% cost reduction with spot instances.",
    tech: ["Kubernetes", "FastAPI", "Prometheus", "Grafana", "ML"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "TOXIC AVENGER",
    damage: "500 RPS @ 70% Cost Cut",
    icon: "🛡️",
  },
  {
    id: 3,
    name: "ML SENTIMENT LOOP",
    subtitle: "8-Service MLOps",
    description: "Production MLOps pipeline with 8 microservices on AWS ECS Fargate. SageMaker training, DynamoDB storage, automated retraining with SNS triggers.",
    tech: ["AWS", "SageMaker", "ECS", "DynamoDB", "FastAPI"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "FEEDBACK FURY",
    damage: "8 Services Deployed",
    icon: "🔄",
  },
  {
    id: 4,
    name: "JOB PORTAL API",
    subtitle: "HATEOAS REST",
    description: "25+ HATEOAS-compliant endpoints with OpenAPI docs, deployed to AWS ECS. Full job lifecycle management with advanced search.",
    tech: ["FastAPI", "PostgreSQL", "Docker", "AWS ECS", "OpenAPI"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "API ANNIHILATOR",
    damage: "25+ Endpoints",
    icon: "💼",
  },
  {
    id: 5,
    name: "FIELDFUZE BACKEND",
    subtitle: "Go Multi-Tenant",
    description: "Multi-tenant RBAC backend in Go with Gin framework. JWT auth, DynamoDB GSI/LSI, real-time sync for field service management.",
    tech: ["Go", "Gin", "DynamoDB", "JWT", "RBAC"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "GO GETTER",
    damage: "Multi-Tenant RBAC",
    icon: "🔷",
  },
  {
    id: 6,
    name: "LAMBDA MICROSERVICES",
    subtitle: "94 Serverless Functions",
    description: "Enterprise serverless architecture with 94 Lambda functions. Stripe payments, Twilio SMS, DocuSign, QuickBooks integrations.",
    tech: ["AWS Lambda", "API Gateway", "Stripe", "Twilio", "Node.js"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "FUNCTION FRENZY",
    damage: "94 Lambdas Deployed",
    icon: "⚡",
  },
  {
    id: 7,
    name: "CRE RESEARCH AGENT",
    subtitle: "RAG + Vector Search",
    description: "AI agent for commercial real estate research using RAG with Qdrant vector DB, embeddings, and reranking for literature review.",
    tech: ["LangChain", "Qdrant", "RAG", "OpenAI", "FastAPI"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "KNOWLEDGE KILLER",
    damage: "Semantic Search",
    icon: "🏢",
  },
  {
    id: 8,
    name: "TRAFFIC FLOW GNN",
    subtitle: "Graph Neural Networks",
    description: "Traffic prediction using Graph Neural Networks on PeMS-BAY dataset. Spatio-temporal modeling with PyTorch Geometric.",
    tech: ["PyTorch", "PyTorch Geometric", "GNN", "NumPy", "Pandas"],
    github: "https://github.com/HAR5HA-7663",
    locoMove: "GRAPH GRENADE",
    damage: "Spatio-Temporal ML",
    icon: "🚗",
  },
];
