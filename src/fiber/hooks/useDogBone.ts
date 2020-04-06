import { useMemo } from "react";
import { useDogContext } from "../context";
import { Bone } from "three";
import { DogBoneName } from "../types";

const getBone = (mesh, name) =>
  mesh && mesh.skeleton.bones.filter((b) => b.name === name)[0];

export const useDogBone = (name: DogBoneName): Bone => {
  const { mesh } = useDogContext();
  return useMemo(() => getBone(mesh, name), [mesh, name]);
};

export const useDogBones = (names: DogBoneName[]): Bone[] => {
  const { mesh } = useDogContext();
  return useMemo(() => names.map((name) => getBone(mesh, name)), [names]);
};
