"use client";

import { useEffect } from "react";
import { ModeProvider, useMode } from "@/contexts/ModeContext";

function ModeEffects() {
  const { isRecruiter } = useMode();

  useEffect(() => {
    if (isRecruiter) {
      document.body.classList.add("recruiter-mode");
    } else {
      document.body.classList.remove("recruiter-mode");
    }
  }, [isRecruiter]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ModeProvider>
      <ModeEffects />
      {children}
    </ModeProvider>
  );
}
