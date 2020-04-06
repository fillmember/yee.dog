import { useEffect } from "react";
import { MathUtils, Vector3 } from "three";
import { useFrame } from "react-three-fiber";
import { useAnimationClip } from "../animation";
import { useDogBone } from "../hooks/useDogBone";
import { rad, arrOf, negate } from "../utils/functional";

const range = (r) => (v, i) => v + r * (i % 2 ? -1 : 1);
const r2 = (v = 0, r) => arrOf(rad(v), 2).map(range(rad(r)));
const duration = 2;
const times = [0, 2];
const jsonX = {
  name: "jsonX",
  duration,
  tracks: [
    {
      type: "number",
      name: "Spine.rotation[y]",
      times,
      values: r2(0, -30),
    },
    {
      type: "number",
      name: "Spine.rotation[z]",
      times,
      values: r2(0, 30),
    },
    {
      type: "number",
      name: "Shoulder.rotation[y]",
      times,
      values: r2(0, -30),
    },
  ],
};
const leg0rx = {
  times: [0, 0.5, 1.5, 2],
  values: [-120, -90, -90, -120].map(rad),
};
const arm0rz = (f = 1) => ({
  times: [0, 0.5, 1, 2],
  values: [190, 180, 180, 200].map((v) => v * f).map(rad),
});
const arm0rx = {
  times: [0, 0.5, 1, 2],
  values: [35, -45, -45, 45].map(rad),
};
const jsonY = {
  name: "jsonY",
  duration,
  tracks: [
    {
      type: "number",
      name: "Pelvis.rotation[x]",
      times,
      values: r2(-90, 20),
    },
    {
      type: "number",
      name: "Spine.rotation[x]",
      times,
      values: r2(-270, 10),
    },
    {
      type: "number",
      name: "Shoulder.rotation[x]",
      times,
      values: r2(45, 15),
    },
    {
      type: "number",
      name: "LegL_0.rotation[x]",
      ...leg0rx,
    },
    {
      type: "number",
      name: "LegR_0.rotation[x]",
      ...leg0rx,
    },
    {
      type: "number",
      name: "ArmL_0.rotation[z]",
      ...arm0rz(-1),
    },
    {
      type: "number",
      name: "ArmR_0.rotation[z]",
      ...arm0rz(1),
    },
    {
      type: "number",
      name: "ArmL_0.rotation[x]",
      ...arm0rx,
    },
    {
      type: "number",
      name: "ArmR_0.rotation[x]",
      ...arm0rx,
    },
    {
      type: "number",
      name: "Tail_0.rotation[x]",
      times: [0, 0.75, 1.25, 2],
      values: [35, 5, 5, -45].map(rad),
    },
  ],
};
const v = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();
const fn2 = (x) => MathUtils.mapLinear(x, 5, -5, 0, duration);
const fn = (head, target) => {
  head.getWorldPosition(v);
  v2.subVectors(v3.fromArray(target), v);
  return [v2.x, v2.y].map(fn2);
};
export const VLegs = ({ target }) => {
  const head = useDogBone("Head");
  const { action: ax } = useAnimationClip(jsonX);
  const { action: ay } = useAnimationClip(jsonY);
  useEffect(() => {
    ax.timeScale = 0;
    ax.time = 0.5;
    ay.time = 0.5;
    ay.timeScale = 0;
    ax.play();
    ay.play();
  }, []);
  useFrame(() => {
    const [tx, ty] = fn(head, target);
    ax.time = MathUtils.lerp(ax.time, tx, 0.1);
    ay.time = MathUtils.lerp(ay.time, ty, 0.1);
  });
  return null;
};
