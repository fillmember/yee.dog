import DoggoBehaviour from "./DoggoBehaviour";

class Resize extends DoggoBehaviour {
  constructor() {
    super();
    this.on("resize", this.onResize);
  }
  onResize = payload => {
    this.DogStore.stage3D.resize(payload);
  };
}

export default Resize;
