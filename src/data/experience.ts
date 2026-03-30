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
    title: "Graduate Research Assistant – Agentic AI",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2025 - Dec 2025",
    type: "work",
    bullets: [
      "Reduced manual research workflow time by 70% by designing multi-agent pipelines (CrewAI + LangChain) that automated literature review and report generation",
      "Deployed 3 persistent agent services on AWS EKS/Fargate with OpenSearch semantic search across 10K+ documents with sub-second retrieval",
      "Cut infrastructure provisioning from 2 hours to 15 minutes using Terraform IaC with GitHub Actions CI/CD",
      "Engineered FastAPI REST and GraphQL APIs backed by AWS Bedrock; benchmarked no-code (n8n) vs. coded agent approaches for 2 follow-on research projects",
    ],
    icon: "🔬",
  },
  {
    id: 1,
    title: "M.S. Computer Science",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2024 - Dec 2025",
    type: "education",
    bullets: [
      "GPA: 3.6/4.0",
      "Focus: AI/ML, Cloud Computing, Distributed Systems",
      "Research: Agentic AI and Multi-Agent Systems",
      "Graduated December 2025",
    ],
    icon: "🎓",
  },
  {
    id: 2,
    title: "SDE-1 (LN Technical Consultant)",
    company: "Infor India Pvt. Ltd.",
    location: "Hyderabad, India",
    period: "Apr 2022 - Dec 2023",
    type: "work",
    bullets: [
      "Delivered REST API integrations for 3 enterprise clients (Ferrari, Boeing, Triumph) processing 500+ daily transactions through AWS Lambda and API Gateway",
      "Reduced batch processing failures from weekly to monthly by resolving 15+ pipeline defects across MySQL databases and distributed ERP systems",
      "Cut deployment turnaround by 25% by containerizing services with Docker and standardizing CI across client environments",
    ],
    icon: "💼",
  },
  {
    id: 3,
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
