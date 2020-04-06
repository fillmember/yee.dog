import { useState, useMemo } from "react";
import { useFrame } from "react-three-fiber";
import { useDogBones } from "../hooks/useDogBone";
import { Wiggle } from "./Wiggle";
import { lerp } from "../utils/functional";

const mapBool = (vTrue = 1, vFalse = 0) => bool => bool ? vTrue : vFalse;
const boolTo01 = mapBool(1,0)
const isCloseToMouse = (b) => b?.userData.distanceToMouse < 0.01 || b?.children.some((c) => c.userData.distanceToMouse < 0.0025)
export const EarWiggle: React.FC = () => {
  const bones = useDogBones(['EarL_0', "EarR_0"])
  const y0 = useMemo(() => bones.map(b => b?.rotation.y) , bones)
  const [proximity, setProximity] = useState<number[]>(bones.map(() => 0))
  useFrame(() => {
    const p1 = bones.map(isCloseToMouse).map(boolTo01)
    setProximity(prev=>prev.map((v,i) => lerp(v,p1[i],0.2)))
  })
  return <>{
    bones.filter(Boolean).map((bone,i) => <Wiggle key={bone.name} object={bone} axis="y" vOffset={y0[i]} amp={0.2 * proximity[i]} speed={0.7} />)
  }</>;
};
