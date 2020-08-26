import { useState, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { useDogBones } from "../hooks/useDogBone";
import { Wiggle } from "./Wiggle";
import { lerp } from "../utils/functional";
import { DogBoneName } from "../types";

const just0 = () => 0;
const mapBool = (vTrue = 1, vFalse = 0) => bool => bool ? vTrue : vFalse;
const boolTo01 = mapBool(1,0)
const isCloseToMouse = (b) => b?.userData.distanceToMouse < 0.005 || b?.children.some((c) => c.userData.distanceToMouse < 0.0025)

export const EarWiggle: React.FC<{bones?: DogBoneName[];}> = ({bones}) => {
  const boneObjs = useDogBones(bones)
  const y0 = useMemo(() => boneObjs.map(b => b?.rotation.y) , boneObjs)
  const [proximity, setProximity] = useState<number[]>(boneObjs.map(just0))
  useFrame(() => {
    const p1 = boneObjs.map(isCloseToMouse).map(boolTo01)
    setProximity(prev=>prev.map((v,i) => lerp(v,p1[i],0.2)))
  })
  return <>{
    boneObjs.filter(Boolean).map((bone,i) => <Wiggle key={bone.name} object={bone} axis="y" vOffset={y0[i]} amp={0.2 * proximity[i]} speed={0.7} />)
  }</>;
};
EarWiggle.defaultProps = {
  bones: ['EarL_0', "EarR_0"]
}
