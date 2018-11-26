import { Vector2 } from "three";
import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import DoggoBehaviour from "./DoggoBehaviour.js";
import DogStore from "../DogStore.js";

const temp = new Vector2();
const isAround = (...boneIDs) => {
  temp.set(0, 0);
  boneIDs.forEach(boneID => {
    const bone = DogStore.stage3D.dog.mesh.skeleton.bones[boneID];
    temp.add(DogStore.stage3D.toScreenPosition(bone));
  });
  temp.multiplyScalar(1 / boneIDs.length);
  const distanceSquared = DogStore.stage3D.mouse2D.distanceToSquared(temp);
  return distanceSquared < 0.0016;
};

export default class PetTheDog extends DoggoBehaviour {
  constructor() {
    super();
    this.on("update", this.onUpdate);
  }
  onRemove() {
    this.off("update", this.onUpdate);
  }
  transitionDuration = 0.5;
  targetWeight = 0.6;
  onUpdate = throttle(() => {
    const action = DogStore.dog.animation.actions[this.action];
    if (action && this.bone) {
      TweenMax.to(action, this.transitionDuration, {
        weight: isAround(...this.bone) ? this.targetWeight : 0
      });
    }
  }, 1000 / 50);
}
