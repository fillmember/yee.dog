import { Mood, EmotionContextContent } from "./types";
import { useContext, useState, createContext } from "react";
import { Controllers } from "./controllers";
export const EmotionContext = createContext<EmotionContextContent>(null);

export const useEmotionContext = (): [
  Omit<EmotionContextContent, "update">,
  EmotionContextContent["update"]
] => {
  const { update, ...state } = useContext(EmotionContext);
  return [state, update];
};

export const Emotion = ({ children }) => {
  const [state, setState] = useState<Partial<Record<Mood, number>>>({});
  const update = (input: Partial<Record<Mood, number>>) => {
    setState((prev) => ({ ...prev, ...input }));
  };
  return (
    <EmotionContext.Provider
      value={{
        ...state,
        update,
      }}
    >
      {children}
      <Controllers />
    </EmotionContext.Provider>
  );
};
