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
import { DogIK, DogIKGroup } from "./ik/dogik";
import { NumberTriplet } from "../3D/Particle/types";

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
        enableZoom={process.env.NODE_ENV === "development"}
        enablePan={process.env.NODE_ENV === "development"}
      />
      <Suspense fallback={false}>
        <Dog>
          <DogDebugger />
          <DogLookAtTarget>
            {target => (
              <>
                {/* <DogBasicLookAt target={target} />
                <VLegs doit={target[1] < 0} /> */}
                <DogIK
                  target={target}
                  boneNames={["Spine", "Shoulder", "Neck", "Head"]}
                />
              </>
            )}
          </DogLookAtTarget>
          <WagTail />
          <EarWiggle />
          {/* <DogIKGroup /> */}
          {/* <DogParticles /> */}
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default DogRun;
