import React, { useMemo } from "react";
import { useLoader } from "react-three-fiber";
import { SkinnedMesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ModelAdjustment } from "./components/ModelAdjustment";
import { useAnimationSystem } from "./animation";
import { useBoneScreenPositions } from "./hooks/useBoneScreenPositions";
import { DogProvider } from "./context";

export function Dog({ children }) {
  const url = "/static/model/wt-json_out/wt-json.gltf";
  const gltf = useLoader(GLTFLoader, url);
  const mesh = useMemo(
    () => gltf.scene.getObjectByName("Wurstgang") as SkinnedMesh,
    [gltf]
  );
  useBoneScreenPositions(mesh);
  const [mixer] = useAnimationSystem(mesh);
  eval("window.dog = mesh");
  return (
    <DogProvider
      value={{
        mesh,
        mixer,
      }}
    >
      <primitive object={gltf.scene} />
      <group>{children}</group>
      <ModelAdjustment />
    </DogProvider>
  );
}
