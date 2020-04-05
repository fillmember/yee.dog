import { useRef } from "react";
import { useFrame } from "react-three-fiber";
import { lerp } from "../utils/functional";

export const useValueVelocity = ({
  initialValue = 0,
  decreaseMomentum = 0.5,
  increaseMomentum = 0.5,
} = {}): any => {
  const refLastValue = useRef(initialValue);
  const velocity = useRef(0);
  const evaluate = (value) => {
    const d = value - refLastValue.current;
    const alpha = d > velocity.current ? increaseMomentum : decreaseMomentum;
    refLastValue.current = value;
    velocity.current = lerp(velocity.current, d, alpha);
  };
  return [evaluate, velocity];
};
