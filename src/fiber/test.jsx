import React, { Suspense } from "react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "./OrbitControls";
import { Dog } from "./Dog";
import { DogDebugger } from "./BDogDebugger";
import { DogBasicLookAt, ObjectLookAt } from "./BDogBasicLookAt";
import { WagTail } from "./BWagTail";
import { BEarWiggle } from "./BEarWiggle";
import { BVLegs } from "./BVLegs";
import { BDogLookAtTarget } from "./BDogLookAtTarget";

const DogRun = () => {
  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={{ fov: 50, position: [0, 4, -15] }}
    >
      <directionalLight position={[0, 1, 0.5]} />
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
          {/* <DogDebugger /> */}
          <BDogLookAtTarget>
            {pos => (
              <>
                <DogBasicLookAt target={pos} />
                <BVLegs doit={pos[1] < 0} />
              </>
            )}
          </BDogLookAtTarget>
          <WagTail />
          <BEarWiggle />
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default DogRun;
