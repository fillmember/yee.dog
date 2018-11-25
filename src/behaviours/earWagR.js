import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../3D/AnimationData";

class earWagR extends DoggoBehaviour {
  onDogReady = dog => {
    dog.animation.makeClips({
      earWagR: Clips.earWagR
    });
    dog.animation.makeActions({
      earWagR: Actions.earWagR
    });
  };
}

export default earWagR;
