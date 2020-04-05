import React, { useContext } from "react";
import { SkinnedMesh, AnimationMixer } from "three";

export const DogContext = React.createContext<{
  mesh: SkinnedMesh;
  mixer: AnimationMixer;
}>({
  mesh: null,
  mixer: null,
});
export const { Provider: DogProvider, Consumer: DogPetter } = DogContext;

export const useDogContext = () => useContext(DogContext);
