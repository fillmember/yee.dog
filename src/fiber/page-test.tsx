import React, { Suspense } from "react";
import { Canvas, Dom } from "react-three-fiber";
import { OrbitControls } from "./components/OrbitControls";
import { Dog } from "./Dog";
import { DogBasicLookAt } from "./components/DogBasicLookAt";
import { WagTail } from "./components/WagTail";
import { EarWiggle } from "./components/EarWiggle";
import { DogLookAtTarget } from "./components/DogLookAtTarget";
import { VLegs } from "./components/VLegs";
// import { DogParticles } from "./components/DogParticles";
import { DogBark } from "./components/DogBark";
import {
  withDropZone,
  DogFileInteraction,
} from "./components/DogFileInteraction";
import { Emotion } from "./emotion";
import { HeadParticlesWithEmotion } from "./components/DogParticles";

const LookAt = () => (
  <DogLookAtTarget>
    {(target) => (
      <>
        <DogBasicLookAt target={target} />
        <VLegs target={target} />
      </>
    )}
  </DogLookAtTarget>
);

const DogRun = ({ dropProps }) => {
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
          <DogBark />
          <Emotion>
            <HeadParticlesWithEmotion />
            <DogFileInteraction {...dropProps} />
          </Emotion>
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default withDropZone(DogRun);
