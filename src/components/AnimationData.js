import BoneID from "./BoneID.js";
import { Math as ThreeMath, LoopPingPong, InterpolateSmooth } from "three";

const toRad = ThreeMath.degToRad;

export const Clips = {
  bark: [
    {
      bone: BoneID.Head,
      property: "rotation[x]",
      times: [0.1, 0.9],
      values: [0, 7].map(toRad)
    },
    {
      bone: BoneID.JawL_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-0.25, -1.0]
    },
    {
      bone: BoneID.JawU_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-0.22, -0.1]
    }
  ],
  wag: [
    {
      bone: BoneID.Tail_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [-7, 7].map(toRad),
      interpolation: InterpolateSmooth
    },
    {
      bone: BoneID.Tail_1,
      property: "rotation[y]",
      times: [0, 1],
      values: [10, -10].map(toRad),
      interpolation: InterpolateSmooth
    },
    {
      bone: BoneID.Tail_2,
      property: "rotation[y]",
      times: [0, 1],
      values: [20, -20].map(toRad),
      interpolation: InterpolateSmooth
    }
  ],
  vleg: [
    {
      bone: BoneID.LegL_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -90].map(toRad)
    },
    {
      bone: BoneID.LegR_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -90].map(toRad)
    },
    {
      bone: BoneID.LegL_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [0, 5].map(toRad)
    },
    {
      bone: BoneID.LegR_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [0, -5].map(toRad)
    },
    {
      bone: BoneID.Pelvis,
      property: "rotation[x]",
      times: [0, 1],
      values: [0, -20].map(toRad)
    },
    {
      bone: BoneID.Spine,
      property: "rotation[x]",
      times: [0, 1],
      values: [0, 15].map(toRad)
    },
    {
      bone: BoneID.Shoulder,
      property: "rotation[x]",
      times: [0, 1],
      values: [0, 15].map(toRad)
    },
    {
      bone: BoneID.ArmL_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [0, 35].map(toRad)
    },
    {
      bone: BoneID.ArmR_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [0, -35].map(toRad)
    },
    {
      bone: BoneID.ArmL_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -70].map(toRad)
    },
    {
      bone: BoneID.ArmR_0,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -70].map(toRad)
    },
    {
      bone: BoneID.ArmL_1,
      property: "rotation[z]",
      times: [0, 1],
      values: [0, 0].map(toRad)
    },
    {
      bone: BoneID.ArmR_1,
      property: "rotation[z]",
      times: [0, 1],
      values: [0, 0].map(toRad)
    },
    {
      bone: BoneID.ArmL_2,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -50].map(toRad)
    },
    {
      bone: BoneID.ArmR_2,
      property: "rotation[x]",
      times: [0, 1],
      values: [-90, -50].map(toRad)
    },
    {
      bone: BoneID.ArmL_2,
      property: "rotation[z]",
      times: [0, 1],
      values: [0, 45].map(toRad)
    },
    {
      bone: BoneID.ArmR_2,
      property: "rotation[z]",
      times: [0, 1],
      values: [0, -45].map(toRad)
    }
  ],
  earWagL: [
    {
      bone: BoneID.EarL_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [20, 50].map(toRad)
    }
  ],
  earWagR: [
    {
      bone: BoneID.EarR_0,
      property: "rotation[y]",
      times: [0, 1],
      values: [-20, -50].map(toRad)
    }
  ]
};

export const Actions = {
  wag: { loop: LoopPingPong, paused: false, timeScale: 4 },
  vleg: { loop: LoopPingPong, paused: true, timeScale: 8 },
  bark: { loop: LoopPingPong, paused: true },
  earWagL: { loop: LoopPingPong, paused: true, timeScale: 10 },
  earWagR: { loop: LoopPingPong, paused: true, timeScale: 10 }
};
