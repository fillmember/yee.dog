import React, { useMemo, useRef } from "react";
import { Vector3, Object3D, Geometry, Math as MathUtil } from "three";
import { useFrame, createPortal } from "react-three-fiber";
import sum from "lodash/sum";
import last from "lodash/last";
import first from "lodash/first";
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

const reusableVector = new Vector3();
const reusableVector2 = new Vector3();

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
  const targetAsV3 = useMemo(() => new Vector3().fromArray(target), target);
  const constrain = (vector: Vector3, index: number): Vector3 => {
    if (index === 0) {
      return vector;
    }
    const target =
      index > 1
        ? reusableVector2.subVectors(
            currentWorldPositions[index - 1],
            currentWorldPositions[index - 2]
          )
        : reusableVector2.subVectors(
            initialWorldPositions[1],
            initialWorldPositions[0]
          );
    target.setLength(vector.length());
    const useAxisOfThisBone = bones[index - 1];
    useAxisOfThisBone.updateWorldMatrix(false, false);
    const axisX = useAxisOfThisBone.localToWorld(new Vector3(1, 0, 0)); // left <-> right
    const axisY = useAxisOfThisBone.localToWorld(new Vector3(0, 1, 0)); // up <-> down
    const vectorX = vector.clone().projectOnPlane(axisX);
    const targetX = target.clone().projectOnPlane(axisX);
    const vectorY = vector.clone().projectOnPlane(axisY);
    const targetY = target.clone().projectOnPlane(axisY);
    // const compareToThisVectorFlattendToBoneXAxis = compareToThisVector.projectOnPlane(
    //   useAxisOfThisBone.localToWorld(new Vector3(1, 0, 0))
    // );
    // const compareToThisVectorFlattendToBoneYAxis = compareToThisVector.projectOnPlane(
    //   useAxisOfThisBone.localToWorld(new Vector3(0, 1, 0))
    // );
    const dotX = vectorX.dot(targetX);
    const cosThetaX = dotX / vectorX.length() / targetX.length();

    const diffX = vectorX.angleTo(targetX);
    const diffY = vectorY.angleTo(targetY);
    if (index === 1) {
      console.log(
        cosThetaX.toFixed(4)
        // MathUtil.radToDeg(diffY).toFixed(0)
      );
      // vector.lerp(target, 1);
    }
    return vector;
  };
  useFrame(() => {
    const base = first(initialWorldPositions);
    const vectorFromBaseToTarget = new Vector3().subVectors(targetAsV3, base);
    const distanceBaseToTarget = vectorFromBaseToTarget.length();
    const outOfReach = totalLength <= distanceBaseToTarget;
    if (outOfReach) {
      // Arrange Bones In A Line To Target
      const cappedVectorFromBaseToTarget = vectorFromBaseToTarget
        .clone()
        .setLength(totalLength);
      let a = 0;
      currentWorldPositions.forEach((current, index) => {
        const vectorFromPreviousToCurrent = cappedVectorFromBaseToTarget
          .clone()
          .setLength(a);
        constrain(vectorFromPreviousToCurrent, index);
        current.copy(base).add(vectorFromPreviousToCurrent);
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
            if (current === last(currentWorldPositions)) {
              current.copy(targetAsV3);
              return;
            }
            // 2. Find the line between current and previous.
            const previousExecutedIndex = index + 1;
            const prev = currentWorldPositions[previousExecutedIndex];
            const vectorFromPreviousToCurrent = reusableVector
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
            const vectorFromPreviousToCurrent = reusableVector
              .subVectors(current, prev)
              .setLength(lengths[index - 1]);
            // New: Constrain
            constrain(vectorFromPreviousToCurrent, index);
            current.addVectors(prev, vectorFromPreviousToCurrent);
          }
        );
        // update cost
        count++;
      }
    }
  });
  const ref = useRef<Geometry>();
  useFrame(() => {
    if (ref.current) {
      ref.current.verticesNeedUpdate = true;
    }
  });
  return (
    <>
      {currentWorldPositions.map((v, index) => (
        <group key={index}>
          <mesh position={v.toArray()}>
            <boxBufferGeometry attach="geometry" args={[0.15, 0.15, 0.15]} />
            <meshBasicMaterial
              attach="material"
              color={["red", "orange", "yellow", "blue"][index]}
            />
          </mesh>
        </group>
      ))}
      <line>
        <geometry
          ref={ref}
          attach="geometry"
          vertices={currentWorldPositions}
        />
        <lineBasicMaterial attach="material" color={0xffffff} linewidth={4} />
      </line>
      <line>
        <geometry attach="geometry" vertices={initialWorldPositions} />
        <lineBasicMaterial attach="material" color={0x000000} linewidth={4} />
      </line>
      {bones.map(bone => createPortal(<axesHelper args={[80]} />, bone))}
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

/* More Notes


h1. Branching

A - Pelvis -> Shoulder
A1 - Shoulder -> Head
A2 - Shoulder -> ArmL_3

1. Work backwards to the sub-base

A1.backward()
A2.backward()

2. get the centroid, set as next part of chain's target and solve
	-- (we're going backwards, then forwards by using solve for chainA)

A.target = _.mean( A1.currentPositions[0] , A2.currentPositions[1] )

A.solve() // i.e. A.backward() + A.forward()

A1.currentPositions[0].copy( last( A.currentPositions ) )
A2.currentPositions[1].copy( last( A.currentPositions ) )

A1.forward()
A2.forward()


h1. Constraints


















*/
