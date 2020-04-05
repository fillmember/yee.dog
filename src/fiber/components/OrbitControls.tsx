import React, { useRef } from "react";
import { OrbitControls as THREEOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree, useFrame, extend } from "react-three-fiber";

extend({ OrbitControls: THREEOrbitControls });

export const OrbitControls = (props) => {
  const { camera } = useThree();
  const controls = useRef<THREEOrbitControls>();
  useFrame(() => {
    const o = controls.current;
    // console.log(o);
    o && o.update();
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, document.querySelector("canvas")]}
      {...props}
    />
  );
};
