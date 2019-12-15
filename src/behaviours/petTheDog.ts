import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import isAroundBones from "./utils/isAroundBones";
import DoggoBehaviour from "./DoggoBehaviour";
import DogStore from "../DogStore";

export default class PetTheDog extends DoggoBehaviour {
  action;
  bone;
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
        weight: isAroundBones({ boneIDs: this.bone }) ? this.targetWeight : 0
      });
    }
  }, 1000 / 50);
}
