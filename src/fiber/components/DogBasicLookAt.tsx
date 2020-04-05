import { useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { Quaternion, Euler, Object3D, MathUtils } from "three";
import clamp from "lodash/clamp";
import { useDogBones } from "../hooks/useDogBone";

import { rad } from "../utils/functional";

export const limit = (value, center, range = 0.1) => {
  const min = center - range;
  const max = center + range;
  return clamp(value, min, max);
};

export const ObjectLookAt = ({
  object,
  target,
  lerp,
  range: [rx, ry, rz],
}: {
  object: Object3D;
  target: number[];
  lerp: number;
  range: number[];
}): null => {
  const [rOriginal, qCurrent] = useMemo<[Euler, Quaternion]>(
    () => [object && object.rotation.clone(), new Quaternion()],
    [object]
  );
  useFrame(() => {
    if (!object) {
      return;
    }
    qCurrent.copy(object.quaternion);
    object.lookAt(target[0], target[1], target[2]);
    object.rotateY(Math.PI);
    object.rotation.x = limit(object.rotation.x, rOriginal.x, rx);
    object.rotation.y = limit(object.rotation.y, rOriginal.y, ry);
    object.rotation.z = limit(object.rotation.z, rOriginal.z, rz);
    object.quaternion.copy(qCurrent.slerp(object.quaternion, lerp));
  });
  return null;
};

type PropsDogBasicLookAt = {
  target: number[];
};

export const DogBasicLookAt = ({ target }: PropsDogBasicLookAt) => {
  const [head, neck] = useDogBones(["Head", "Neck"]);
  return (
    <>
      <ObjectLookAt
        range={[30, 30, 30].map(rad)}
        object={head}
        target={target}
        lerp={0.1}
      />
      <ObjectLookAt
        range={[15, 15, 15].map(rad)}
        object={neck}
        target={target}
        lerp={0.06}
      />
    </>
  );
};
