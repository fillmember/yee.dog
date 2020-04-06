import sum from "lodash/sum";
import random from "lodash/random";
import { useState } from "react";
import { useFrame } from "react-three-fiber";
import { ParticleTextureMap01 } from "../../3D/ParticleTextureMap";
import { useValueVelocity } from "../../hooks/useValueVelocity";
import { HeadParticles } from "./DogParticles";
const velocity = () => [
  random(-0.01, 0.01, true),
  0.015,
  random(-0.01, 0.01, true),
];
const useVV = () =>
  useValueVelocity({
    initialValue: 0,
    decreaseMomentum: 0.5,
    increaseMomentum: 0.5,
  });
export const DogConfusedByCameraSpeed = () => {
  const [rate, setRate] = useState(0);
  const velocityObservers = [useVV(), useVV(), useVV()];
  useFrame(({ camera, clock: { elapsedTime } }) => {
    if (elapsedTime <= 2) return;
    const { x, y, z } = camera.position;
    setRate(
      sum(
        [x, y, z].map((value, index) => {
          const [evaluate, velocity] = velocityObservers[index];
          evaluate(value);
          return Math.abs(velocity.current) / 1.5;
        })
      )
    );
  });
  return (
    <HeadParticles
      rate={rate}
      velocity={velocity}
      sprite={ParticleTextureMap01["?"]}
      lifespan={[0.7, 1, 1.5]}
      size={1}
      count={6}
    />
  );
};
