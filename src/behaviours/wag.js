import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../3D/AnimationData";

class Wag extends DoggoBehaviour {
  onDogReady = dog => {
    dog.animation.makeClips({
      wag: Clips.wag
    });
    dog.animation.makeActions({
      wag: Actions.wag
    });
  };
}

export default Wag;
