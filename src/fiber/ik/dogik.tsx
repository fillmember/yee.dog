import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Bone, Vector3, Object3D } from "three";
import { useFrame } from "react-three-fiber";
import sum from "lodash/sum";
import last from "lodash/last";
import first from "lodash/first";
import forEach from "lodash/forEach";
import { useDogBones, NumberTriplet, DogBoneName } from "../utils";

function cost(tip: Vector3, target: Vector3) {
  return tip.distanceTo(target);
}

function reverseForeach<T>(
  arr: T[],
  fn: (current: T, index: number, array: T[]) => void
) {
  for (let index = arr.length - 1; index >= 0; index--) {
    fn(arr[index], index, arr);
  }
}

function object3DToWorldPositions(obj3d: Object3D): Vector3 {
  obj3d.updateWorldMatrix(true, false);
  return obj3d.getWorldPosition(new Vector3());
}

function computeLengths(worldPositions: Vector3[]): number[] {
  return worldPositions.map((currentPos, index) => {
    return index === worldPositions.length - 1
      ? 0
      : new Vector3()
          .subVectors(currentPos, worldPositions[index + 1])
          .length();
  });
}

export const DogIK = ({
  target,
  boneNames
}: {
  target: NumberTriplet;
  boneNames: DogBoneName[];
}): JSX.Element => {
  const bones = useDogBones(boneNames);
  const initialWorldPositions = useMemo(
    () => bones.map(object3DToWorldPositions),
    boneNames
  );
  const lengths = useMemo(() => computeLengths(initialWorldPositions), [
    initialWorldPositions
  ]);
  const currentWorldPositions = useMemo(
    () => initialWorldPositions.map(v => v.clone()),
    [initialWorldPositions]
  );
  const totalLength = useMemo(() => sum(lengths), [lengths]);
  useFrame(() => {
    const len = currentWorldPositions.length;
    const base = first(initialWorldPositions);
    const targetAsV3 = new Vector3().fromArray(target);
    const vectorFromBaseToTarget = new Vector3().subVectors(base, targetAsV3);
    const distanceBaseToTarget = vectorFromBaseToTarget.length();
    const outOfReach = totalLength <= distanceBaseToTarget;
    if (outOfReach) {
      // Arrange Bones In A Line To Target
      const cappedVectorFromBaseToTarget = vectorFromBaseToTarget
        .clone()
        .setLength(totalLength);
      let a = 0;
      currentWorldPositions.forEach((current, index) => {
        current
          .copy(base)
          .sub(cappedVectorFromBaseToTarget.clone().setLength(a));
        a += lengths[index];
      });
    } else {
      let count = 0;
      while (
        cost(first(currentWorldPositions), targetAsV3) > 0.001 &&
        count < 3
      ) {
        /*
        Backward Pass

        1. Set the tip at the target.
        2. Find the line between tip and parent.
        3. Move parent on the line, and keep the original bone length to tip
        4. Find the line between parent and grand-parent.
        5. Move grand-parent on the line... (recursively)
        */
        reverseForeach(
          currentWorldPositions,
          (current, index): void => {
            // 1. Set the tip at the target
            if (index === len - 1) {
              current.copy(targetAsV3);
              return;
            }
            // 2. Find the line between current and previous.
            const previousExecutedIndex = index + 1;
            const prev = currentWorldPositions[previousExecutedIndex];
            const vectorFromPreviousToCurrent = new Vector3()
              .subVectors(current, prev)
              .setLength(lengths[index]);
            // 3. Set current on the found line, with distance of its length to previous
            current.addVectors(prev, vectorFromPreviousToCurrent);
          }
        );
        /*
        Forward Pass

        1. Set the base at the origin.
        2. Find the line between 0 and 1
        3. Move 1 on the line, and keep the original bone length to 0
        4. Find the line between 1 and 2
        5. Move 2 on the line... (recursively)
        */
        currentWorldPositions.forEach(
          (current, index): void => {
            if (index === 0) {
              current.copy(initialWorldPositions[0]);
              return;
            }
            const previousExecutedIndex = index - 1;
            // 2. Find the line between current and next
            const prev = currentWorldPositions[previousExecutedIndex];
            const vectorFromPreviousToCurrent = new Vector3()
              .subVectors(current, prev)
              .setLength(lengths[index - 1]);
            current.addVectors(prev, vectorFromPreviousToCurrent);
          }
        );
        // update cost
        count++;
      }
    }
  });
  return (
    <>
      {currentWorldPositions.map((v, index) => (
        <mesh key={index} position={v.toArray()}>
          <boxBufferGeometry attach="geometry" args={[0.3, 0.3, 0.3]} />
          <meshBasicMaterial
            attach="material"
            color={["red", "orange", "yellow", "blue"][index]}
          />
          {/* <Dom>{bones[index].name}</Dom> */}
        </mesh>
      ))}
      <mesh position={target}>
        <sphereBufferGeometry attach="geometry" args={[0.4, 0.4, 0.4]} />
        <meshBasicMaterial attach="material" color={"red"} />
      </mesh>
    </>
  );
};

export const DogIKGroup = () => {
  const limbs: DogBoneName[] = ["LegR_3", "LegL_3", "ArmR_2", "ArmR_2"];
  const [legR, legL, armR, armL] = useDogBones(limbs);
  return (
    <>
      <DogIK
        target={legR.position.toArray() as NumberTriplet}
        boneNames={["LegR_0", "LegR_1", "LegR_2", "LegR_3"]}
      />
      <DogIK
        target={legL.position.toArray() as NumberTriplet}
        boneNames={["LegL_0", "LegL_1", "LegL_2", "LegL_3"]}
      />
      <DogIK
        target={armR.position.toArray() as NumberTriplet}
        boneNames={["ArmR_0", "ArmR_1", "ArmR_2"]}
      />
      <DogIK
        target={armL.position.toArray() as NumberTriplet}
        boneNames={["ArmL_0", "ArmL_1", "ArmL_2"]}
      />
    </>
  );
};
