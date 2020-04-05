import { useMemo, useContext, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import { AnimationMixer, AnimationClip } from "three";
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

export const useAnimationClip = (json) => {
  const { mixer } = useContext(DogContext);
  const clip = useMemo(() => AnimationClip.parse(json), []);
  const action = useMemo(
    () => mixer.existingAction(clip) || mixer.clipAction(clip),
    [clip]
  );
  return { clip, action };
};
