import React, { Suspense } from "react";
import { Canvas, Dom } from "react-three-fiber";
import { OrbitControls } from "./components/OrbitControls";
import { Dog } from "./Dog";
import { DogBasicLookAt } from "./components/DogBasicLookAt";
import { WagTail } from "./components/WagTail";
import { EarWiggle } from "./components/EarWiggle";
import { DogLookAtTarget } from "./components/DogLookAtTarget";

const LookAt = () => (
  <DogLookAtTarget>
    {(target) => (
      <>
        <DogBasicLookAt target={target} />
      </>
    )}
  </DogLookAtTarget>
);

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
      <Suspense
        fallback={
          <Dom>
            <h1>loading</h1>
          </Dom>
        }
      >
        <Dog>
          <LookAt />
          <WagTail />
          <EarWiggle />
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default DogRun;
