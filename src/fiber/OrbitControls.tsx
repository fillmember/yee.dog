import React, { useRef } from "react";
import { OrbitControls as THREEOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree, useRender, extend, useFrame } from "react-three-fiber";

extend({ OrbitControls: THREEOrbitControls });

export const OrbitControls = ({ target, ...rest }) => {
  const { camera } = useThree();
  const controls = useRef<THREEOrbitControls>();
  useRender(() => {
    controls.current && controls.current.update();
  }, false);
  return (
    <orbitControls
      ref={controls}
      args={[camera, document.querySelector("canvas")]}
      {...rest}
    />
  );
};
