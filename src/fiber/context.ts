import React, { useContext } from "react";
import { SkinnedMesh, AnimationMixer } from "three";

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
