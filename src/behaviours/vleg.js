import { TweenMax, Power2 } from "gsap";
import debounce from "lodash/debounce";
import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../data/animations";

class Vleg extends DoggoBehaviour {
  onDogReady = dog => {
    dog.animation.makeClips({
      vleg: Clips.vleg
    });
    dog.animation.makeActions({
      vleg: Actions.vleg
    });
    this.on("pointer_move", this.onPointerMove);
  };
  useMouse = false;
  onPointerMove = debounce(() => {
    if (this.useMouse !== true) {
      return;
    }
    const action = this.DogStore.dog.animation.actions.vleg;
    TweenMax.to(action, 1, {
      time: this.DogStore.stage3D.mouse3D.y < 0 ? 1 : 0,
      ease: Power2.easeOut
    });
  }, 30);
}

export default Vleg;
