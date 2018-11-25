import throttle from "lodash/throttle";
import DoggoBehaviour from "./DoggoBehaviour.js";
import DogStore from "../DogStore";
export default class baseMouseTo3D extends DoggoBehaviour {
  constructor() {
    super();
    this.on("pointer_move", this.onPointerMove);
    this.on("update", this.onUpdate);
  }
  onRemove() {
    this.off("pointer_move", this.onPointerMove);
    this.off("update", this.onUpdate);
  }
  onPointerMove = evt => {
    const renderer = DogStore.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (evt.offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(evt.offsetY / canvas.offsetHeight) * 2 + 1;
      DogStore.stage3D.updatePointer({ x, y });
    }
  };
  onUpdate = throttle(() => {
    const {
      raycaster,
      mouse3D,
      mouse2D,
      camera,
      mousePlane
    } = DogStore.stage3D;
    raycaster.setFromCamera(mouse2D, camera);
    let intersect = [];
    raycaster.intersectObject(mousePlane, false, intersect);
    intersect.forEach(({ point }) => {
      mouse3D.copy(point);
    });
  }, 1000 / 30);
}
