import { DogContext } from "./Dog";
import { useContext, useState, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { Bone, Quaternion, Euler, Vector3 } from "three";
import clamp from "lodash/clamp";
export const limit = (value, center, range = 0.1) => {
  const min = center - range;
  const max = center + range;
  return clamp(value, min, max);
};

export const ObjectLookAt = ({
  boneId,
  target,
  lerp,
  range: [rx, ry, rz]
}: {
  boneId: string;
  target: [number, number, number];
  lerp: number;
  range: [number, number, number];
}) => {
  const { mesh } = useContext(DogContext);
  const joint: Bone = mesh.skeleton.bones.filter(
    ({ name }) => name === boneId
  )[0];
  const original = useMemo<Euler>(() => joint.rotation.clone(), [joint]);
  const q = new Quaternion();
  useFrame(() => {
    if (!joint) {
      return;
    }
    q.copy(joint.quaternion);
    joint.lookAt(...target);
    joint.rotateY(Math.PI);
    joint.rotation.x = limit(joint.rotation.x, original.x, rx);
    joint.rotation.y = limit(joint.rotation.y, original.y, ry);
    joint.rotation.z = limit(joint.rotation.z, original.z, rz);
    joint.quaternion.copy(q.slerp(joint.quaternion, lerp));
  });
  return <></>;
};

export const DogBasicLookAt = () => {
  const [pos, setPos] = useState<[number, number, number]>([0, 0, 5]);
  useFrame(({ camera, mouse }) => {
    setPos(camera
      .localToWorld(new Vector3(mouse.x * 4, mouse.y * 4, -5))
      .toArray() as [number, number, number]);
  });
  return (
    <>
      <mesh position={pos}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshNormalMaterial attach="material" />
      </mesh>
      <ObjectLookAt
        range={[0.2, 0.6, 0.2]}
        boneId="Head"
        target={pos}
        lerp={0.3}
      />
      <ObjectLookAt
        range={[0.3, 2, 0.1]}
        boneId="Neck"
        target={pos}
        lerp={0.1}
      />
      <ObjectLookAt
        range={[0, 0.1, 0]}
        boneId="Spine"
        target={pos}
        lerp={0.15}
      />
    </>
  );
};
