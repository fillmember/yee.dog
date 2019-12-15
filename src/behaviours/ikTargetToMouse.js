import DoggoBehaviour from "./DoggoBehaviour";
import DogStore from "../DogStore";

export default class ikTargetToMouse extends DoggoBehaviour {
  constructor() {
    super();
    this.on("base_ik_created", this.onBaseIKCreated);
  }
  onBaseIKCreated = ik => {
    this.ik = ik;
    this.on("update", this.onUpdate);
  };
  onUpdate = () => {
    const chain = this.ik && this.ik.chains[this.chain];
    if (chain) {
      chain.target.set(DogStore.stage3D.mouse3D);
    }
  };
}
