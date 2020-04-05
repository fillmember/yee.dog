import { ParticleSystem } from "../particlesystem/ParticleSystem";
import random from "lodash/random";
import { Vector3 } from "three";
import { useDogBone } from "../hooks/useDogBone";
import { useMemo } from "react";
import { useThree } from "react-three-fiber";
import { ParticleTextureMap01 } from "../../3D/ParticleTextureMap";
import { EmitterOptions } from "../../3D/Particle/Emitter";

enum ParticleSet {
  Confused,
  Loved,
}

const map: Record<
  ParticleSet,
  Partial<EmitterOptions> & {
    positionFn?: Function;
    effectFn?: Function;
    count?: number;
  }
> = {
  [ParticleSet.Confused]: {
    rate: 2,
    count: 16,
    lifespan: [0.7, 1, 1.5],
    sprite: ParticleTextureMap01["?"],
    velocity: () => [0, 0.015, 0] as number[],
    size: [0.5, 0.75, 1],
  },
  [ParticleSet.Loved]: {
    rate: 2.5,
    count: 16,
    lifespan: [1, 1.5, 2],
    sprite: ParticleTextureMap01["❤"],
    velocity: () =>
      [
        random(-0.0025, 0.0025, true),
        0.015,
        random(-0.0025, 0.0025, true),
      ] as number[],
    size: [0.5, 0.75, 1],
  },
};

export const HeadParticles = () => {
  const { clock } = useThree();
  const head = useDogBone("Head");
  const { velocity, sprite, lifespan, rate, size, positionFn, count } = map[
    ParticleSet.Confused
  ];
  const emitterOptions = useMemo(
    () => ({
      enabled: !!head,
      rate,
      size,
      position: (): number[] => {
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
          z + cos + random(-0.3, 0, true),
        ];
      },
      lifespan,
      sprite,
      velocity,
    }),
    [head]
  );
  return <ParticleSystem count={count} emitterOptions={emitterOptions} />;
};

const temp = new Vector3(0, 0, 0);
export const DogParticles = () => {
  return (
    <group>
      <HeadParticles />
    </group>
  );
};
