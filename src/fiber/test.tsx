import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "./OrbitControls";
import { Dog } from "./Dog";
import { DogDebugger } from "./DogDebugger";
import { DogBasicLookAt } from "./DogBasicLookAt";
import { WagTail } from "./WagTail";
import { EarWiggle } from "./EarWiggle";
import { VLegs } from "./VLegs";
import { DogLookAtTarget } from "./DogLookAtTarget";
import { DogParticles } from "./DogParticles";

const DogRun = () => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ fov: 50, position: [0, 4, -15] }}
    >
      <directionalLight position={[0, 10, -15]} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        rotateSpeed={2}
        damingFactor={0.05}
        enableZoom={false}
        enablePan={false}
      />
      <Suspense fallback={false}>
        <Dog>
          <DogDebugger />
          <DogLookAtTarget>
            {target => (
              <>
                <DogBasicLookAt target={target} />
                <VLegs doit={target[1] < 0} />
              </>
            )}
          </DogLookAtTarget>
          <WagTail />
          <EarWiggle />
          <DogParticles />
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default DogRun;
