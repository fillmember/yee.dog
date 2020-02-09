import { useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { Quaternion, Euler, Object3D } from "three";
import clamp from "lodash/clamp";
import { NumberTriplet, useDogBones } from "./utils";

export const limit = (value, center, range = 0.1) => {
  const min = center - range;
  const max = center + range;
  return clamp(value, min, max);
};

export const ObjectLookAt = ({
  object,
  target,
  lerp,
  range: [rx, ry, rz]
}: {
  object: Object3D;
  target: NumberTriplet;
  lerp: number;
  range: NumberTriplet;
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
    object.lookAt(...target);
    object.rotateY(Math.PI);
    object.rotation.x = limit(object.rotation.x, rOriginal.x, rx);
    object.rotation.y = limit(object.rotation.y, rOriginal.y, ry);
    object.rotation.z = limit(object.rotation.z, rOriginal.z, rz);
    object.quaternion.copy(qCurrent.slerp(object.quaternion, lerp));
  });
  return null;
};

type PropsDogBasicLookAt = {
  target: NumberTriplet;
};

export const DogBasicLookAt = ({ target }: PropsDogBasicLookAt) => {
  const [head, neck, shoulder] = useDogBones(["Head", "Neck", "Shoulder"]);
  return (
    <>
      <ObjectLookAt
        range={[0.5, 0.5, 0.2]}
        object={head}
        target={target}
        lerp={0.3}
      />
      <ObjectLookAt
        range={[0.3, 0.8, 0.1]}
        object={neck}
        target={target}
        lerp={0.2}
      />
      <ObjectLookAt
        range={[0.1, 0, 0]}
        object={shoulder}
        target={target}
        lerp={0.1}
      />
    </>
  );
};
