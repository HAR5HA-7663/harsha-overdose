"use client";

import { ModeProvider } from "@/contexts/ModeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ModeProvider>{children}</ModeProvider>;
}
