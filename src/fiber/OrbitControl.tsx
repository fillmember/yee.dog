import React, { useRef } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useThree, useRender, extend } from "react-three-fiber";

extend({ OrbitControls });

export default props => {
  const { camera } = useThree();
  const controls = useRef<OrbitControls>();
  useRender(() => {
    controls.current && controls.current.update();
  }, false);
  return (
    <orbitControls
      ref={controls}
      args={[camera, document.querySelector("canvas")]}
      {...props}
    />
  );
};
