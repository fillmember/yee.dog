import round from "lodash/round";
import { Math as MathUtils } from "three";
import { useFrame } from "react-three-fiber";
import { useDogBone, useDogBones } from "../hooks/useDogBone";
import { Wiggle } from "./Wiggle";
import { useMemo } from "react";

const rzOffset = 0.35;
const rz0 = [Math.PI, Math.PI];
const rz1 = [Math.PI - rzOffset, Math.PI + rzOffset];

const toRad = MathUtils.degToRad;

const animation = [
  {
    bone: "LegL_0",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -90],
  },
  {
    bone: "LegR_0",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -90],
  },
  {
    bone: "LegL_0",
    property: "rotation.y",
    times: [0, 1],
    values: [0, 5],
  },
  {
    bone: "LegR_0",
    property: "rotation.y",
    times: [0, 1],
    values: [0, -5],
  },
  {
    bone: "Pelvis",
    property: "rotation.x",
    times: [0, 1],
    values: [0, 20],
  },
  {
    bone: "Spine",
    property: "rotation.x",
    times: [0, 1],
    values: [0, 15],
  },
  {
    bone: "Shoulder",
    property: "rotation.x",
    times: [0, 1],
    values: [0, 15],
  },
  {
    bone: "ArmL_0",
    property: "rotation.y",
    times: [0, 1],
    values: [0, 35],
  },
  {
    bone: "ArmR_0",
    property: "rotation.y",
    times: [0, 1],
    values: [0, -35],
  },
  {
    bone: "ArmL_0",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -70],
  },
  {
    bone: "ArmR_0",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -70],
  },
  {
    bone: "ArmL_1",
    property: "rotation[z]",
    times: [0, 1],
    values: [0, 0],
  },
  {
    bone: "ArmR_1",
    property: "rotation[z]",
    times: [0, 1],
    values: [0, 0],
  },
  {
    bone: "ArmL_2",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -70],
  },
  {
    bone: "ArmR_2",
    property: "rotation.x",
    times: [0, 1],
    values: [-90, -70],
  },
  {
    bone: "ArmL_2",
    property: "rotation.z",
    times: [0, 1],
    values: [0, 20],
  },
  {
    bone: "ArmR_2",
    property: "rotation.z",
    times: [0, 1],
    values: [0, -20],
  },
];

export const VLegs = ({ doit }) => {
  const [armL, armR] = useDogBones(["ArmL_0", "ArmR_0"]);
  const [shoulder, spine, pelvis] = useDogBones([
    "Shoulder",
    "Spine",
    "Pelvis",
  ]);
  // const p0 = useMemo(() => {
  //   return [armL.position.clone(), armR.position.clone()];
  // }, [armL, armR]);
  // const p1 = useMemo(() => {
  //   const [pl, pr] = p0.map((v) => v.clone());
  //   pl.x -= 30;
  //   pr.x += 30;
  //   pl.z -= 50;
  //   pr.z -= 50;
  //   return [pl, pr];
  // }, [p0]);
  // useFrame(() => {
  //   let [ltrz, rtrz] = doit ? rz1 : rz0;
  //   armL.rotation.z += (ltrz - armL.rotation.z) * 0.1;
  //   armR.rotation.z += (rtrz - armR.rotation.z) * 0.1;
  //   // let [ltp, rtp] = doit ? p1 : p0;
  //   // armL.position.lerp(ltp, 0.1);
  //   // armR.position.lerp(rtp, 0.1);
  // });
  useFrame(() => {
    armL.rotation.x = -0.8 + Math.max(0, shoulder.rotation.x);
    armR.rotation.x = -0.8 + Math.max(0, shoulder.rotation.x);
    // armL.rotation.z =
    //   -3.14 - Math.min(0.6, Math.abs(shoulder.rotation.x + 0.3));
    // armR.rotation.z = 3.14 + Math.min(0.6, Math.abs(shoulder.rotation.x + 0.3));
  });
  return null;
};
