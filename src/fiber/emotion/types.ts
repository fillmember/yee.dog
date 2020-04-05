export enum Mood {
  Curious = "curious",
  Surprised = "surprised",
}

export type EmotionContextContent = {
  [Mood.Curious]?: number;
  [Mood.Surprised]?: number;
  update: (input: Partial<Record<Mood, number>>) => void;
};
