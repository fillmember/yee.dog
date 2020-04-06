import { useMemo, useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { Quaternion, Euler, Object3D } from "three";
import clamp from "lodash/clamp";
import { useDogBones } from "../hooks/useDogBone";
import { rad } from "../utils/functional";
import { DogBoneName } from "../types";
import { subscribe } from "../DogEvent";

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

export const DogBasicLookAt = ({
  bones,
  target,
  range,
  lerp,
}: {
  target: number[];
  bones: DogBoneName[];
  range: number[][];
  lerp: number[];
}) => {
  const [barking, setBarking] = useState(null);
  const t2 = [target[0], target[1] + (barking ? 10 : 0), target[2]];
  useEffect(() => subscribe("bark", setBarking), []);
  return (
    <>
      {useDogBones(bones)
        .filter(Boolean)
        .map((bone, index) => (
          <ObjectLookAt
            key={bone.name}
            object={bone}
            target={t2}
            range={range[index]}
            lerp={lerp[index] * (barking ? 1.5 : 1)}
          />
        ))}
    </>
  );
};

DogBasicLookAt.defaultProps = {
  bones: ["Head", "Neck"],
  range: [[30, 30, 30].map(rad), [15, 15, 15].map(rad)],
  lerp: [0.06, 0.1],
};
