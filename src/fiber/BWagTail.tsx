import throttle from "lodash/throttle";
import { Wiggle } from "./Wiggle";
import { useDogBones, DogBoneName } from "./utils";
import { useFrame } from "react-three-fiber";
import { useState } from "react";

type Props = {
  boneNames?: DogBoneName[];
  vOffsets?: number[];
  speed?: number;
};

export const WagTail = ({
  speed = 0.2,
  boneNames = ["Tail_0", "Tail_1", "Tail_2"],
  vOffsets = [-Math.PI, 0, 0]
}: Props) => {
  const bones = useDogBones(boneNames);
  const [intensity, setIntensity] = useState(1);
  useFrame(
    throttle(() => {
      const target = bones.some(b => b && b.userData.distanceToMouse < 0.01)
        ? 1
        : 0;
      setIntensity(intensity * 0.9 + target * 0.1);
    }, 300)
  );
  return bones
    .filter(Boolean)
    .map((bone, index) => (
      <Wiggle
        key={bone.name}
        object={bone}
        axis="z"
        speed={speed + intensity * 0.1}
        amp={0.3 - index * 0.1 + intensity * 0.2}
        vOffset={vOffsets[index]}
      />
    ));
};
