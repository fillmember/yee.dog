import BoneID from "../3D/BoneID";

export default {
  worm: {
    joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck, BoneID.Head],
    constraints: [40, 15, 10, 5],
    influence: 0.1,
    clipWeight: 1
  },
  look: {
    joints: [BoneID.Shoulder, BoneID.Neck],
    // joints: [BoneID.Neck, BoneID.Head],
    // constraint: (joint, axis, value) => {
    //   return value;
    // },
    influence: 0,
    clipWeight: 1
  }
};
