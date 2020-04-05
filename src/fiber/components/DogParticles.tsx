import { ParticleSystem } from "../particlesystem/ParticleSystem";
import random from "lodash/random";
import { Vector3 } from "three";
import { useDogBone } from "../hooks/useDogBone";
import { useMemo } from "react";
import { useThree } from "react-three-fiber";
import { ParticleTextureMap01 } from "../../3D/ParticleTextureMap";
import { EmitterOptions } from "../../3D/Particle/Emitter";
import { useEmotionContext } from "../emotion";

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
    velocity: () => [0, 0.015, 0],
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
const temp = new Vector3(0, 0, 0);
export const HeadParticles = ({
  velocity,
  sprite,
  lifespan,
  rate,
  size,
  positionFn,
  count,
}) => {
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

export const HeadParticlesWithEmotion = () => {
  const [{ curious, surprised }] = useEmotionContext();
  const isCurious = curious > 0.5;
  const isSurprised = surprised > 0.5;
  const sprite = useMemo(() => {
    if (isCurious) {
      return [ParticleTextureMap01["?"]];
    }
    if (isSurprised) {
      return [ParticleTextureMap01["!"]];
    }
    return [ParticleTextureMap01["0"], ParticleTextureMap01["1"]];
  }, [isCurious, isSurprised]);
  const rate = useMemo(() => {
    if (isCurious) return curious * 10;
    if (isSurprised) return 1;
    return 0;
  }, [curious, isCurious, isSurprised]);
  const lifespan = useMemo(() => {
    if (isCurious) return [0.7, 1, 1.5];
    if (isSurprised) return 2;
  }, [isCurious, isSurprised]);
  return (
    <HeadParticles
      rate={rate}
      velocity={() => [
        random(-0.01, 0.01, true),
        0.015,
        random(-0.01, 0.01, true),
      ]}
      sprite={sprite}
      lifespan={lifespan}
      size={[1]}
      count={32}
      positionFn={null}
    />
  );
};
