import { useState, useMemo, useEffect } from "react";
import throttle from "lodash/throttle";
import { Wiggle } from "./Wiggle";
import { useDogBones } from "../hooks/useDogBone";
import { DogBoneName } from "../types";
import { useFrame } from "react-three-fiber";
type Props = {
  boneNames?: DogBoneName[];
  amp?: number;
};
export const EarWiggle = ({
  boneNames = ["EarL_0", "EarR_0"],
  amp = 0.1,
}: Props): JSX.Element => {
  const bones = useDogBones(boneNames);
  const originalRotations = useMemo(
    () => bones.map((b) => b && b.rotation.clone()),
    [bones]
  );
  const [intensities, setIntensities] = useState<number[]>(
    boneNames.map(() => 0)
  );
  useFrame(
    throttle(() => {
      setIntensities(
        bones
          .map((b) =>
            b &&
            (b.userData.distanceToMouse < 0.02 ||
              b.children.some((c) => c.userData.distanceToMouse < 0.005))
              ? 1
              : 0
          )
          .map((a, index) => intensities[index] * 0.9 + a * 0.1)
      );
    }, 1000)
  );
  return (
    <>
      {bones.filter(Boolean).map((bone, index) => (
        <Wiggle
          key={bone.name}
          object={bone}
          axis="y"
          amp={intensities[index] * amp}
          speed={0.2 + intensities[index] * 0.5}
          vOffset={originalRotations[index].y}
        />
      ))}
    </>
  );
};
