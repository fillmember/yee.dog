import React, { useContext } from "react";
import { DogContext } from "./Dog";
import { createPortal } from "react-three-fiber";
import BoneID from "../3D/BoneID";

export const DogDebugger = () => {
  const { mesh } = useContext(DogContext);
  if (!mesh) {
    return null;
  }
  const pelvis = mesh.skeleton.bones[BoneID.Pelvis];
  eval("window.dog = mesh");
  return (
    <group>
      {/* <skeletonHelper name="DogDebugger.SkeletonHelper" args={[pelvis]} /> */}
      {mesh.skeleton.bones.map(bone =>
        createPortal(<axesHelper args={[80]} />, bone)
      )}
    </group>
  );
};
