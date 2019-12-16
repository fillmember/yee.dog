import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { Dog } from "./Dog";
import Controls from "./OrbitControl";
import { DogDebugger } from "./DogDebugger";
import { DogBasicLookAt } from "./DogBasicLookAt";

export default () => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ fov: 66, position: [0, 4, -10] }}
    >
      <directionalLight position={[0, 1, 0.5]} />
      <Controls
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        rotateSpeed={2}
        damingFactor={0.05}
      />
      <Suspense fallback={false}>
        <Dog>
          <DogDebugger />
          <DogBasicLookAt />
        </Dog>
      </Suspense>
    </Canvas>
  );
};
