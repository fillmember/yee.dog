import BoneID from "../3D/BoneID";

export default {
  worm: {
    joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck, BoneID.Head],
    constraints: [90, 45, 25, 15],
    influence: 0.1,
    clipWeight: 0.5
  },
  look: {
    joints: [BoneID.Shoulder, BoneID.Neck, BoneID.Head],
    constraints: [20, 85, 65],
    influence: 0.1,
    clipWeight: 1
  }
};
