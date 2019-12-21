import { useFrame, extend } from "react-three-fiber";
import { System, Mesh, Geometry, Emitter } from "../3D/Particle";
import random from "lodash/random";
import { useMemo, useRef, useEffect } from "react";
import { useMaterial } from "./particlesystem/useMaterial";
import { useEmitter } from "./particlesystem/useEmitter";
import { BufferAttribute, Vector2 } from "three";
import { NumberTriplet } from "./utils";

extend({
  ParticleSystem: System,
  ParticleMesh: Mesh
});

type IParticleSystem = {
  particleCount?: number;
};

// const useFloat32Array = count =>
//   useMemo(() => new Float32Array(count).fill(0).map(() => random(0, 10)), [
//     count
//   ]);

const useOld = (particleCount: number = 8) => {
  const material = useMaterial("/static/images/particle_tex_0.png");
  const geometry = useMemo(() => new Geometry(particleCount), [particleCount]);
  const oldEmitter = new Emitter({
    enabled: true,
    rate: 8,
    position: [0, 0, 0],
    acceleration: () =>
      [random(-1, 1, true), random(-1, 1, true), random(-1, 1, true)].map(
        v => v / 200
      ) as NumberTriplet
  });
  const system = useMemo(() => {
    const s = new System(geometry, material);
    s.addEmitter(oldEmitter);
    return s;
  }, []);
  useFrame(({ clock }, delta) => system.update(clock.getElapsedTime(), delta));
  return system;
};

export const ParticleSystem = ({ particleCount = 4 }: IParticleSystem) => {
  const system = useOld();
  return <primitive object={system} />;
  const material = useMaterial("/static/images/particle_tex_0.png");
  const geometry = useMemo(() => new Geometry(particleCount), [particleCount]);
  geometry.prepareSpritemaps(8, 8);
  const emitter = useEmitter({
    enabled: true,
    rate: 2,
    velocity: () => [
      random(-1, 1, true),
      random(-1, 1, true),
      random(-1, 1, true)
    ],
    acceleration: () => [
      random(-0.01, 0.01, true),
      random(-0.01, 0.01, true),
      random(-0.01, 0.01, true)
    ]
  });
  const particleCountX3 = particleCount * 3;
  const [arrVelocity, arrAcceration] = useMemo(() => {
    return [
      new Float32Array(particleCountX3),
      new Float32Array(particleCountX3)
    ];
  }, [particleCountX3]);
  const mesh = useRef(null);
  useFrame(({ clock }, delta) => {
    eval("window.mesh = mesh.current;");
    const attrTranslate = geometry.getAttribute("translate") as BufferAttribute;
    // Emitter
    emitter(geometry, arrAcceration, arrVelocity, clock.elapsedTime, delta);
    // Effector
    // Move
    arrAcceration.forEach((value, index) => {
      arrVelocity[index] += value;
    });
    attrTranslate.copyArray(
      arrVelocity.map((v, i) => v + attrTranslate.array[i])
    );
  });
  return (
    <group>
      <gridHelper />
      <mesh ref={mesh} frustumCulled={false}>
        {/* <primitive object={geometry} attach="geometry" /> */}
        {/* <primitive
          object={material}
          attach="material"
          defines-TEXTURE
          defines-SPRITEMAP
          uniforms-spritemap={{
            type: "v2",
            value: new Vector2(material.columns, material.rows)
          }}
        /> */}
      </mesh>
    </group>
  );
};
