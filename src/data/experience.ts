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
    title: "Student Consultant – Build Fellowship",
    company: "Open Avenues Foundation",
    location: "United States · Remote",
    period: "Feb 2026 - Present",
    type: "work",
    bullets: [
      "Building a GPT-style transformer language model from scratch using PyTorch",
      "Covers self-attention, positional encoding, tokenization, and text generation",
      "Mentored by Kacper Raczy (Data Science Fellow, comma.ai)",
      "8-week expert-level program through The Build Fellowship",
    ],
    icon: "🧠",
  },
  {
    id: 1,
    title: "Graduate Research Assistant",
    company: "Lawrence Technological University",
    location: "Southfield, MI",
    period: "Jan 2024 - Dec 2025",
    type: "work",
    bullets: [
      "Built multi-agent systems with CrewAI + LangChain MCP for workflow automation",
      "Deployed MCP agent services on AWS Fargate and Amazon EKS",
      "Integrated OpenSearch Serverless for semantic search and RAG",
      "Achieved 70% reduction in manual process time with hybrid AI pipelines",
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
      "GPA: 3.6/4.0",
      "Focus: AI/ML, Cloud Computing, Distributed Systems",
      "Research: Agentic AI and Multi-Agent Systems",
      "Graduated December 2025",
    ],
    icon: "🎓",
  },
  {
    id: 3,
    title: "LN Technical Consultant",
    company: "Infor India Pvt. Ltd.",
    location: "Hyderabad, India",
    period: "Apr 2022 - Dec 2023",
    type: "work",
    bullets: [
      "Developed production tools for Ferrari, Boeing, and Triumph",
      "Integrated Infor ION with AWS S3, Lambda, and API Gateway",
      "Containerized services with Docker, simulated K8s orchestration",
      "Reduced batch processing delays by ~40%",
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
