import { Vector2 } from "three";
import DogStore from "../../DogStore";

const temp = new Vector2();
const isAround = ({ boneIDs, maxDistance = 0.0016 } = {}) => {
  temp.set(0, 0);
  boneIDs.forEach(boneID => {
    const bone = DogStore.stage3D.dog.mesh.skeleton.bones[boneID];
    temp.add(DogStore.stage3D.toScreenPosition(bone));
  });
  temp.multiplyScalar(1 / boneIDs.length);
  const distanceSquared = DogStore.stage3D.mouse2D.distanceToSquared(temp);
  return distanceSquared < maxDistance;
};

export default isAround;
