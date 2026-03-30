export interface Certification {
  id: number;
  name: string;
  issuer: string;
  date: string;
  verifyUrl: string;
  icon: string;
}

export const certifications: Certification[] = [
  {
    id: 1,
    name: "Claude with Amazon Bedrock",
    issuer: "Anthropic",
    date: "Mar 2026",
    verifyUrl: "https://verify.skilljar.com/c/uificikeyd5a",
    icon: "🤖",
  },
  {
    id: 2,
    name: "Model Context Protocol: Advanced Topics",
    issuer: "Anthropic",
    date: "Mar 2026",
    verifyUrl: "https://verify.skilljar.com/c/42ycargwac88",
    icon: "🔗",
  },
  {
    id: 3,
    name: "Amazon Nova AI Challenge: Trusted AI Track",
    issuer: "Amazon",
    date: "2025",
    verifyUrl: "",
    icon: "🏆",
  },
];
