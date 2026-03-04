"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Mode = "artistic" | "recruiter";

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
  isRecruiter: boolean;
  isPro: boolean; // alias for isRecruiter (backward compat)
}

const ModeContext = createContext<ModeContextValue>({
  mode: "recruiter",
  toggleMode: () => {},
  isRecruiter: true,
  isPro: true,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("recruiter");

  // Read ?mode=artistic from URL on mount (artistic is the non-default)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "artistic") {
      setMode("artistic");
    }
  }, []);

  const toggleMode = () => {
    setMode((current) => {
      const next = current === "recruiter" ? "artistic" : "recruiter";
      const url = new URL(window.location.href);
      if (next === "artistic") {
        url.searchParams.set("mode", "artistic");
      } else {
        url.searchParams.delete("mode");
      }
      window.history.replaceState({}, "", url.toString());
      return next;
    });
  };

  const isRecruiter = mode === "recruiter";

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isRecruiter, isPro: isRecruiter }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
