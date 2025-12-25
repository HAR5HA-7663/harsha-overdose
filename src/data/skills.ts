export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
  icon: string;
}

export const skills: Skill[] = [
  // Languages - Primary
  { name: "Python", level: 95, category: "Languages", icon: "🐍" },
  { name: "Go", level: 80, category: "Languages", icon: "🔷" },
  { name: "TypeScript", level: 85, category: "Languages", icon: "📘" },
  { name: "JavaScript", level: 90, category: "Languages", icon: "⚡" },

  // Cloud & Infrastructure
  { name: "AWS", level: 90, category: "Cloud", icon: "☁️" },
  { name: "Docker", level: 88, category: "Cloud", icon: "🐳" },
  { name: "Kubernetes", level: 82, category: "Cloud", icon: "⚙️" },
  { name: "Terraform", level: 75, category: "Cloud", icon: "🏗️" },

  // Backend
  { name: "FastAPI", level: 92, category: "Backend", icon: "🚀" },
  { name: "Flask", level: 85, category: "Backend", icon: "🌶️" },
  { name: "Gin (Go)", level: 78, category: "Backend", icon: "🍸" },
  { name: "REST APIs", level: 95, category: "Backend", icon: "🔌" },

  // AI/ML
  { name: "TensorFlow", level: 85, category: "AI/ML", icon: "🧠" },
  { name: "PyTorch", level: 82, category: "AI/ML", icon: "🔥" },
  { name: "LangChain", level: 88, category: "AI/ML", icon: "🔗" },
  { name: "LLM Fine-tuning", level: 80, category: "AI/ML", icon: "🎯" },

  // DevOps
  { name: "Jenkins", level: 80, category: "DevOps", icon: "🔧" },
  { name: "GitHub Actions", level: 85, category: "DevOps", icon: "🎬" },
  { name: "Prometheus", level: 75, category: "DevOps", icon: "📊" },
  { name: "CI/CD", level: 88, category: "DevOps", icon: "♾️" },

  // Databases
  { name: "PostgreSQL", level: 88, category: "Database", icon: "🐘" },
  { name: "DynamoDB", level: 85, category: "Database", icon: "⚡" },
  { name: "Redis", level: 80, category: "Database", icon: "🔴" },
  { name: "Vector DBs", level: 78, category: "Database", icon: "🎯" },
];

export const categories = [...new Set(skills.map(s => s.category))];
