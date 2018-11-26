import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../data/animations";

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
