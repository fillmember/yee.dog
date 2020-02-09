import { useFrame } from "react-three-fiber";
import { useDogBone, useDogBones } from "./utils";
import { Wiggle } from "./Wiggle";
import { useMemo } from "react";

const rzOffset = 0.35;
const rz0 = [Math.PI, Math.PI];
const rz1 = [Math.PI - rzOffset, Math.PI + rzOffset];

export const VLegs = ({ doit }) => {
  const [armL, armR] = useDogBones(["ArmL_0", "ArmR_0"]);
  const p0 = useMemo(() => {
    return [armL.position.clone(), armR.position.clone()];
  }, [armL, armR]);
  const p1 = useMemo(() => {
    const [pl, pr] = p0.map(v => v.clone());
    pl.x -= 30;
    pr.x += 30;
    pl.z -= 50;
    pr.z -= 50;
    return [pl, pr];
  }, [p0]);
  useFrame(() => {
    let [ltrz, rtrz] = doit ? rz1 : rz0;
    armL.rotation.z += (ltrz - armL.rotation.z) * 0.1;
    armR.rotation.z += (rtrz - armR.rotation.z) * 0.1;
    let [ltp, rtp] = doit ? p1 : p0;
    armL.position.lerp(ltp, 0.1);
    armR.position.lerp(rtp, 0.1);
  });
  return null;
};
