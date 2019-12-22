import { ParticleSystem } from "./particlesystem/ParticleSystem";
import random from "lodash/random";
import { Vector3 } from "three";
import { NumberTriplet, useDogBone } from "./utils";
import { useMemo } from "react";
import { useThree } from "react-three-fiber";
import { ParticleTextureMap01 } from "../3D/ParticleTextureMap";
import { EmitterOptions } from "../3D/Particle/Emitter";

const map: Record<
  string,
  Partial<EmitterOptions> & { positionFn?: Function; effectFn?: Function }
> = {
  confused: {
    rate: 2,
    lifespan: [0.7, 1, 1.5],
    sprite: ParticleTextureMap01["?"],
    velocity: () => [0, 0.02, 0] as NumberTriplet,
    size: [0.25, 0.5, 0.7]
  },
  loved: {
    rate: 2.5,
    lifespan: [1, 1.5, 2],
    sprite: ParticleTextureMap01["❤"],
    velocity: () =>
      [
        random(-0.0025, 0.0025, true),
        0.015,
        random(-0.0025, 0.0025, true)
      ] as NumberTriplet,
    size: [0.25, 0.5, 0.7]
  },
  surprised: {
    rate: 0.5,
    lifespan: 2.25,
    size: 2,
    velocity: [0, 0, 0],
    sprite: ParticleTextureMap01["!"],
    positionFn: ({ x, y, z }) => [x, y + 1.7, z] as NumberTriplet
  }
};

export const HeadParticles = () => {
  const { clock } = useThree();
  const head = useDogBone("Head");
  const { velocity, sprite, lifespan, rate, size, positionFn } = map[
    "surprised"
  ];
  const emitterOptions = useMemo(
    () => ({
      enabled: !!head,
      rate,
      size,
      position: (): NumberTriplet => {
        const sin = 0.6 * Math.sin(clock.elapsedTime * random(8, 12));
        const cos = 0.6 * Math.sin(clock.elapsedTime * random(8, 12));
        head.getWorldPosition(temp);
        if (positionFn) {
          return positionFn(temp, clock);
        }
        const { x, y, z } = temp;
        return [
          x + sin + random(-0.3, 0.3, true),
          y + 0.85,
          z + cos + random(-0.3, 0, true)
        ];
      },
      lifespan,
      sprite,
      velocity
    }),
    [head]
  );
  return <ParticleSystem count={32} emitterOptions={emitterOptions} />;
};

const temp = new Vector3(0, 0, 0);
export const DogParticles = () => {
  return (
    <group>
      <HeadParticles />
    </group>
  );
};
