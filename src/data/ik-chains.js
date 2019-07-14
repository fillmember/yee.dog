import BoneID from "../3D/BoneID";

export default {
  worm: {
    joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck, BoneID.Head],
    constraints: [40, 15, 10, 5],
    influence: 0.1,
    clipWeight: 0.5
  },
  look: {
    joints: [BoneID.Shoulder, BoneID.Neck, BoneID.Head],
    constraints: [10, 40, 30].map(v => v * 1.2),
    influence: 0.1,
    clipWeight: 1
  }
};
