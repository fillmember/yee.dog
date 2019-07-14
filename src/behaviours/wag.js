import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../data/animations";
import isAroundBones from "./utils/isAroundBones";
import DogStore from "../DogStore";
import BoneID from "../3D/BoneID";

class Wag extends DoggoBehaviour {
  constructor() {
    super();
    this.on("update", this.onUpdate);
  }
  onRemove() {
    this.off("update", this.onUpdate);
  }
  onDogReady = dog => {
    dog.animation.makeClips({
      wag: Clips.wag
    });
    dog.animation.makeActions({
      wag: Actions.wag
    });
  };
  onUpdate = throttle(() => {
    const action = DogStore.dog.animation.actions["wag"];
    if (action) {
      const isA = isAroundBones({
        boneIDs: [
          BoneID.Pelvis,
          BoneID.Tail_0,
          BoneID.Tail_1,
          BoneID.Tail_2,
          BoneID.Tail_3
        ],
        maxDistance: 0.005
      });
      TweenMax.to(action, 0.5, {
        weight: isA ? 1 : 0.8,
        timeScale: isA ? 8 : 4
      });
    }
  }, 1000 / 50);
}

export default Wag;
