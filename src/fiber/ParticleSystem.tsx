import { useFrame, extend } from "react-three-fiber";
import { System, Geometry, Emitter } from "../3D/Particle";
import { useMemo, useRef } from "react";
import { useMaterial } from "./particlesystem/useMaterial";

extend({
  ParticleSystem: System,
  ParticleEmitter: Emitter
});
type IParticleSystem = {
  particleCount?: number;
};
export const ParticleSystem = ({ particleCount = 4 }: IParticleSystem) => {
  const refSystem = useRef(null);
  const material = useMaterial("/static/images/particle_tex_0.png");
  const geometry = useMemo(() => new Geometry(particleCount), [particleCount]);
  useFrame(({ clock }, delta) => refSystem?.current?.update(clock.getElapsedTime(), delta));
  return (
    <particleSystem ref={refSystem} args={[geometry, material]}>
      <particleEmitter rate={4} attachObject={["emitters", 0]} />
    </particleSystem>
  );
};
