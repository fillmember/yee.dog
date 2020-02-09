import { useMemo, useContext } from "react";
import { DogContext } from "./Dog";
import { Bone } from "three";
// prettier-ignore
export type DogBoneName = "Pelvis" | "Spine" | "Shoulder" | "Neck" | "Head" | "JawU_0" | "JawU_1" | "JawL_0" | "JawL_1" | "EarL_0" | "EarL_1" | "EarR_0" | "EarR_1" | "ArmL_0" | "ArmL_1" | "ArmL_2" | "ArmL_3" | "ArmR_0" | "ArmR_1" | "ArmR_2" | "ArmR_3" | "Tail_0" | "Tail_1" | "Tail_2" | "Tail_3" | "LegL_0" | "LegL_1" | "LegL_2" | "LegL_3" | "LegL_4" | "LegR_0" | "LegR_1" | "LegR_2" | "LegR_3" | "LegR_4"
export type NumberTriplet = [number, number, number];

const getBone = (mesh, name) =>
  mesh && mesh.skeleton.bones.filter(b => b.name === name)[0];

export const useDogBone = (name: DogBoneName): Bone => {
  const { mesh } = useContext(DogContext);
  return useMemo(() => getBone(mesh, name), [mesh, name]);
};

export const useDogBones = (names: DogBoneName[]): Bone[] => {
  const { mesh } = useContext(DogContext);
  return useMemo(() => names.map(name => getBone(mesh, name)), [names]);
};
