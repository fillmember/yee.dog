import { ParticleSystem } from "../particlesystem/ParticleSystem";
import random from "lodash/random";
import { Vector3, Clock } from "three";
import { useDogBone } from "../hooks/useDogBone";
import { useMemo } from "react";
import { useThree } from "react-three-fiber";
import { EmitterOptions } from "../../3D/Particle/Emitter";

const temp = new Vector3(0, 0, 0);
export const HeadParticles: React.FC<
  EmitterOptions & {
    count: number;
    positionFn?: (headPosition: Vector3, clock: Clock) => number[];
  }
> = ({ velocity, sprite, lifespan, rate, size, positionFn, count }) => {
  const { clock } = useThree();
  const head = useDogBone("Head");
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
    [velocity, sprite, lifespan, rate, size, positionFn, count]
  );
  return <ParticleSystem count={count} emitterOptions={emitterOptions} />;
};
