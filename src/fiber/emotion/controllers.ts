import { useDogBones } from "../hooks/useDogBone";
import { useValueVelocity } from "../hooks/useValueVelocity";
import { useFrame } from "react-three-fiber";
import { Mood } from "./types";
import { mapL } from "../utils/functional";
import { useEmotionContext } from ".";

export const useEmotionController = () => {
  const [, update] = useEmotionContext()
  const [head] = useDogBones(["Head"]);
    const [evalX, vX] = useValueVelocity({
      decreaseMomentum: 0.1,
      increaseMomentum: 0.6,
    });
    const [evalY, vY] = useValueVelocity({
      decreaseMomentum: 0.2,
      increaseMomentum: 0.5,
    });
    useFrame(() => {
      evalX(head.userData.screenPos?.x || 0);
      evalY(head.userData.screenPos?.y || 0);
      update({
        [Mood.Curious]: mapL(
          Math.abs(vX.current) + Math.abs(vY.current),
          0,
          0.2,
          0,
          1
        ),
      });
    });
}

export const Controllers = () => {
  useEmotionController()
  return null
}
