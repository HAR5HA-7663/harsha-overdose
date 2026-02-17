"use client";

import { createContext, useContext, useState } from "react";

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
  const toggleMode = () =>
    setMode((m) => (m === "creative" ? "pro" : "creative"));

  return (
    <ModeContext.Provider value={{ mode, toggleMode, isPro: mode === "pro" }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
