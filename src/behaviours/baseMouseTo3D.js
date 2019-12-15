import throttle from "lodash/throttle";
import DoggoBehaviour from "./DoggoBehaviour";
import DogStore from "../DogStore";
export default class baseMouseTo3D extends DoggoBehaviour {
  static transformMouseCoordinate({ offsetX, offsetY }) {
    const renderer = DogStore.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(offsetY / canvas.offsetHeight) * 2 + 1;
      return { x, y };
    }
    return { x: -999, y: -999 };
  }
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
    DogStore.stage3D.updatePointer(baseMouseTo3D.transformMouseCoordinate(evt));
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
