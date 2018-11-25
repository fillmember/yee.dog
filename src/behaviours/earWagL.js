import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../3D/AnimationData";

class earWagL extends DoggoBehaviour {
  onDogReady = dog => {
    dog.animation.makeClips({
      earWagL: Clips.earWagL
    });
    dog.animation.makeActions({
      earWagL: Actions.earWagL
    });
  };
}

export default earWagL;
