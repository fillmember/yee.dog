import { useFrame, extend } from "react-three-fiber";
import { System, Geometry, Emitter } from "../3D/Particle";
import { EmitterOptions } from '../3D/Particle/Emitter';
import { useMemo, useRef } from "react";
import { useMaterial } from "./particlesystem/useMaterial";

extend({
  ParticleSystem: System,
  ParticleEmitter: Emitter
});
type IParticleSystem = {
  count?: number;
  emitterOptions?: EmitterOptions;
};
export const ParticleSystem = ({ count = 4, emitterOptions = {} }: IParticleSystem) => {
  const refSystem = useRef(null);
  const material = useMaterial("/static/images/particle_tex_0.png");
  const geometry = useMemo(() => new Geometry(count), [count]);
  useFrame(({ clock }, delta) => refSystem?.current?.update(clock.getElapsedTime(), delta));
  return (
    <particleSystem ref={refSystem} args={[geometry, material]}>
      <particleEmitter attachObject={["emitters", 0]} {...emitterOptions} />
    </particleSystem>
  );
};
