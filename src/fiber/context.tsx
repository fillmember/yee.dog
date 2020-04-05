import noop from "lodash/noop";
import React, { useContext } from "react";
import { SkinnedMesh, AnimationMixer } from "three";
import { Mood } from "./types/mood";

type DogContextType = {
  mesh: SkinnedMesh;
  mixer: AnimationMixer;
};

export const DogContext = React.createContext<DogContextType>({
  mesh: null,
  mixer: null,
});
export const { Provider: DogProvider, Consumer: DogPetter } = DogContext;

export const useDogContext = () => useContext(DogContext);
