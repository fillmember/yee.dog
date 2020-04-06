import { useFrame } from "react-three-fiber";
import { useMemo } from "react";
export const Wiggle = ({
  object = null,
  axis = "x",
  property = "rotation",
  amp = 1,
  speed = 0.1,
  vOffset = 0
}): null => {
  const clock = useMemo(() => ({ t: 0 }), []);
  useFrame(() => {
    if (!object) return;
    object[property][axis] = vOffset + Math.sin(clock.t) * amp;
    clock.t += speed;
  });
  return null;
};
