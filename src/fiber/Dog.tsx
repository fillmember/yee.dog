import React, { useMemo, useEffect } from "react";
import { useLoader } from "react-three-fiber";
import {
  LinearEncoding,
  MeshLambertMaterial,
  SkinnedMesh,
  MeshStandardMaterial
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const DogContext = React.createContext({ mesh: null });
export const { Provider: DogProvider, Consumer: DogPetter } = DogContext;

export function Dog({ children }) {
  const url = "/static/model/wt.glb";
  const gltf = useLoader(GLTFLoader, url);
  const mesh: SkinnedMesh = useMemo(
    () => gltf.scene.getObjectByName("Wurstgang") as SkinnedMesh,
    [gltf]
  );
  useEffect(() => {
    mesh.scale.set(1, 1, 1);
    const { map } = mesh.material as MeshStandardMaterial;
    map.encoding = LinearEncoding;
    mesh.material = new MeshLambertMaterial({
      skinning: true,
      color: 0x444444,
      map,
      emissive: 0xffffff,
      emissiveMap: map
    });
  }, [gltf]);
  const dog = useMemo(() => {
    return {
      mesh
    };
  }, [gltf]);
  return (
    <DogProvider value={dog}>
      <primitive object={gltf.scene} />
      <group>{children}</group>
    </DogProvider>
  );
}
