import React, { useMemo, useEffect, useContext, useReducer } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import throttle from "lodash/throttle";
import get from "lodash/get";
import {
  LinearEncoding,
  MeshLambertMaterial,
  SkinnedMesh,
  MeshStandardMaterial,
  Vector3
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export enum Mood {
  Confused,
  LoveStruck,
  Surprised,
  Amazed
}

export const DogContext = React.createContext({
  mesh: null
});
export const { Provider: DogProvider, Consumer: DogPetter } = DogContext;

const useBoneScreenPositions = (mesh, enabled = true) => {
  const bones = get(mesh, "skeleton.bones", []);
  const vs = useMemo(() => bones.map(() => new Vector3()), [bones]);
  useFrame(
    throttle(({ camera, mouse }) => {
      if (!enabled || bones.length === 0) return;
      vs.forEach((v, index) => {
        const bone = bones[index];
        v.setFromMatrixPosition(bone.matrixWorld).project(camera);
        bone.userData.distanceToMouse = mouse.distanceToSquared(v);
        bone.userData.screenPos = v;
      });
    }, 100)
  );
  return vs;
};

export function Dog({ children }) {
  const url = "/static/model/wt.glb";
  const gltf = useLoader(GLTFLoader, url);
  const mesh: SkinnedMesh = useMemo(
    () => gltf.scene.getObjectByName("Wurstgang") as SkinnedMesh,
    [gltf]
  );
  useEffect(() => {
    if (!mesh) return;
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
  useBoneScreenPositions(mesh);
  return (
    <DogProvider
      value={{
        mesh
      }}
    >
      <primitive object={gltf.scene} />
      <group>{children}</group>
    </DogProvider>
  );
}

export const useDog = () => {
  const { mesh } = useContext(DogContext);
  return mesh;
};
