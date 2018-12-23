import DoggoBehaviour from "./DoggoBehaviour";
import { InReact } from "./DoggoBehaviourReact";
import DogStore from "../DogStore";
import { DogIK } from "../3D/IK";

export default class BaseIK extends DoggoBehaviour {
  onDogReady() {
    this.controller = new DogIK();
    this.controller.init({
      scene: DogStore.stage3D.scene,
      mesh: DogStore.dog.mesh,
      chains: this.chains
    });
    this.controller.createAnimationClips();
    this.controller.createAnimationActions(DogStore.dog.animation);
    this.on("update", this.onUpdate);
    DogStore.emit("base_ik_created", this.controller);
  }
  onUpdate = dt => {
    this.controller.update(dt);
  };
}

export const BehaviourBaseIKInReact = InReact(BaseIK, {
  chains: require("../data/ik-chains.js").default
});
BehaviourBaseIKInReact.displayName = "BehaviourBaseIKInReact";
