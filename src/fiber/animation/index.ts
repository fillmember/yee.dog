import { useMemo, useContext } from "react";
import { useFrame } from "react-three-fiber";
import { AnimationMixer } from "three";
import { DogContext } from "../context";

export const useAnimationSystem = (mesh) => {
  var mixer = useMemo(() => new AnimationMixer(mesh), [mesh]);
  useFrame(({ clock }) => {
    if (clock.running) {
      mixer.update(clock.getDelta());
    }
  });
  return [mixer];
};

export const useAnimationClip = () => {
  return useContext(DogContext);
};
