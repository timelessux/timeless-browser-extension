import React, { createContext, ReactNode, useContext, useState } from "react";
type playerContext = {
  isPlaying: string | null;
  setIsPlaying: (url: string | null) => void;
};
const playerContextDefaultValue = {
  isPlaying: null,
  setIsPlaying: () => {},
};
const context = createContext<playerContext>(playerContextDefaultValue);

export function usePlayerContext() {
  return useContext(context);
}

export function PlayerProvider({ children }: { children: ReactNode | string | JSX.Element }) {
  const [isPlay, setIsPlay] = useState<string | null>(null);
  function setIsPlaying(url: string | null) {
    setIsPlay(url);
  }
  const value = {
    isPlaying: isPlay,
    setIsPlaying,
  };
  return <context.Provider value={value}>{children}</context.Provider>;
}
