import { TweenMax, Power2 } from "gsap";
import DoggoBehaviour from "./DoggoBehaviour";
import { Clips, Actions } from "../3D/AnimationData";

class Bark extends DoggoBehaviour {
  static EVENT_BARK_START = "EVENT_BARK_START";
  static EVENT_BARK_END = "EVENT_BARK_END";
  // default props
  useMouse = true;
  constructor() {
    super();
    this.on(this.DogStore.Event.pointer_down, this.openMouth);
    this.on(this.DogStore.Event.pointer_up, this.closeMouth);
  }
  onDogReady = dog => {
    dog.animation.makeClips({
      bark: Clips.bark
    });
    dog.animation.makeActions({
      bark: Actions.bark
    });
  };
  openMouth = evt => {
    if (this.useMouse === true) {
      this.bark(true);
    }
  };
  closeMouth = evt => {
    if (this.useMouse === true) {
      this.bark(false);
    }
  };
  bark = (bool, duration = 0.1) => {
    const action = this.DogStore.dog.animation.actions.bark;
    TweenMax.to(action, duration, {
      time: bool ? 1 : 0,
      ease: Power2.easeOut
    });
    this.DogStore.events.emit(
      bool ? Bark.EVENT_BARK_START : Bark.EVENT_BARK_END
    );
  };
}

export default Bark;
