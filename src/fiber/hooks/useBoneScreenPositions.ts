import { useMemo } from "react";
import { Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import throttle from "lodash/throttle";
import get from "lodash/get";

export const useBoneScreenPositions = (mesh, enabled = true) => {
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
