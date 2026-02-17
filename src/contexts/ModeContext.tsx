"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Mode = "creative" | "pro";

interface ModeContextValue {
  mode: Mode;
  toggleMode: () => void;
  isPro: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "creative",
  toggleMode: () => {},
  isPro: false,
});

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("creative");

  // Read ?mode=pro from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "pro") {
      setMode("pro");
    }
  }, []);

  const toggleMode = () => {
    setMode((current) => {
      const next = current === "creative" ? "pro" : "creative";
      // Keep URL in sync so the link is always shareable
      const url = new URL(window.location.href);
      if (next === "pro") {
        url.searchParams.set("mode", "pro");
      } else {
        url.searchParams.delete("mode");
      }
      window.history.replaceState({}, "", url.toString());
      return next;
    });
  };

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isPro: mode === "pro" }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
