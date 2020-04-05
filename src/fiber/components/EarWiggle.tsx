import { useEffect } from "react";
import { LoopPingPong } from "three";
import { DogBoneName } from "../types";
import { useFrame } from "react-three-fiber";
import { arrOf, lerp } from "../utils/functional";
import { useAnimationClip } from "../animation";
import { useDogBones } from "../hooks/useDogBone";

const json = (boneName: DogBoneName, n: number) => ({
  name: `wiggle-${boneName}`,
  duration: 2,
  tracks: [
    {
      type: "number",
      name: `${boneName}.rotation[y]`,
      times: [0, 1, 2],
      values: arrOf(0.59 * n, 3).map((v, i) => v + (i - 1) * 0.2 * n),
    },
  ],
});
const jsonL = json("EarL_0", 1);
const jsonR = json("EarR_0", -1);
const mapBool = (vTrue = 1, vFalse = 0) => bool => bool ? vTrue : vFalse;
const boolTo01 = mapBool(1,0)
const isCloseToMouse = (b) => b?.userData.distanceToMouse < 0.02 || b?.children.some((c) => c.userData.distanceToMouse < 0.005)
const boolToScale = mapBool(170,120)
const boolToAlpha = mapBool(0.1,0.2)

export const EarWiggle: React.FC = () => {
  const bones = useDogBones(['EarL_0', "EarR_0"])
  const animations = [useAnimationClip(jsonL), useAnimationClip(jsonR)];
  useEffect(() => {
    animations.forEach(({ action }) => {
      action.setLoop(LoopPingPong, Infinity);
      action.timeScale = 170;
      action.weight = 0;
      action.play();
    });
  }, []);
  useFrame(() => {
    const proximity = bones.map(isCloseToMouse)
    const weights = proximity.map(boolTo01)
    const scales = proximity.map(boolToScale)
    const alphas = proximity.map(boolToAlpha)
    animations.forEach(({action}, index) => {
      action.weight = lerp( action.weight, weights[index], alphas[index])
      action.timeScale = lerp( action.timeScale, scales[index], alphas[index])
    })
  })
  return null;
};
