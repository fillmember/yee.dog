import React, { Suspense } from "react";
import { Canvas, Dom } from "react-three-fiber";
import { OrbitControls } from "./components/OrbitControls";
import { Dog } from "./Dog";
import { DogBasicLookAt } from "./components/DogBasicLookAt";
import { WagTail } from "./components/WagTail";
import { EarWiggle } from "./components/EarWiggle";
import { DogLookAtTarget } from "./components/DogLookAtTarget";
import { VLegs } from "./components/VLegs";
import { DogBark } from "./components/DogBark";
import {
  withDropZone,
  DogFileInteraction,
  Event,
} from "./components/DogFileInteraction";
import { DogConfusedByCameraSpeed } from "./components/DogConfusedByCameraSpeed";
import { EventHandler } from "./DogEvent";

const transformTarget = (target, barking) => {
  const [x, y, z] = target;
  let oZ = 0;
  let oY = 0;
  if (barking) {
    if (y > 0) {
      oY = 20;
    } else {
      oZ = z > 0 ? 20 : -20;
    }
  }
  return [x, y + oY, z + oZ];
};

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
        target={[0, 1, 0]}
        damingFactor={0.05}
        enableZoom={process.env.NODE_ENV === "development"}
        enablePan={process.env.NODE_ENV === "development"}
        maxDistance={15}
      />
      <Suspense
        fallback={
          <Dom center>
            <h1>loading...</h1>
          </Dom>
        }
      >
        <Dog>
          <DogLookAtTarget>
            {(target) => (
              <EventHandler events={["bark", Event.Eating]}>
                {([barking, eating]) => (
                  <>
                    <DogBasicLookAt
                      target={transformTarget(target, barking)}
                      lerp={DogBasicLookAt.defaultProps.lerp.map(
                        (v) => (barking ? 1.5 : 1) * v
                      )}
                    />
                    <VLegs target={eating ? [0, -2, -10] : target} />
                  </>
                )}
              </EventHandler>
            )}
          </DogLookAtTarget>
          <WagTail />
          <EarWiggle />
          <DogFileInteraction {...dropProps} />
          <EventHandler events={[Event.Eating, Event.Surprised]}>
            {([isEating, isSurprised]) => (
              <>
                <DogBark enabled={!isEating && !isSurprised} />
              </>
            )}
          </EventHandler>
          <EventHandler events={[Event.Surprised]}>
            {([isSurprised]) => (
              <DogConfusedByCameraSpeed rateMultiplier={isSurprised ? 0 : 1} />
            )}
          </EventHandler>
        </Dog>
      </Suspense>
    </Canvas>
  );
};
export default withDropZone(DogRun);
