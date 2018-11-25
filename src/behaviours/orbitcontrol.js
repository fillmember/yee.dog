import {
  MOUSE,
  Quaternion,
  Spherical,
  Vector3,
  Vector2,
  PerspectiveCamera,
  EventDispatcher
} from "three";
import MakeOrbitControls from "three-orbit-controls";
import DoggoBehaviour from "./DoggoBehaviour";

const THREEOrbitControls = MakeOrbitControls({
  MOUSE,
  Quaternion,
  Spherical,
  Vector3,
  Vector2,
  PerspectiveCamera,
  EventDispatcher
});

class OrbitControl extends DoggoBehaviour {
  static defaultProps = {
    autoRotate: true,
    autoRotateSpeed: 0.033,
    enableDamping: true,
    rotateSpeed: 0.3,
    dampingFactor: 0.1,
    enablePan: false,
    enableZoom: false
  };
  constructor() {
    super();
    this.on("update", this.onUpdate);
    this.orbitcontrols = new THREEOrbitControls(
      this.DogStore.stage3D.camera,
      this.DogStore.stage3D.renderer.domElement
    );
    const defaults = OrbitControl.defaultProps;
    const o = this.orbitcontrols;
    o.autoRotate = this.autoRotate || defaults.autoRotate;
    o.autoRotateSpeed = this.autoRotateSpeed || defaults.autoRotateSpeed;
    o.enableDamping = this.enableDamping || defaults.enableDamping;
    o.rotateSpeed = this.rotateSpeed || defaults.rotateSpeed;
    o.dampingFactor = this.dampingFactor || defaults.dampingFactor;
    o.enablePan = this.enablePan || defaults.enablePan;
    o.enableZoom = this.enableZoom || defaults.enableZoom;
  }
  set(key, value) {
    this[key] = value;
    this.orbitcontrols[key] = value;
  }
  onUpdate = dt => {
    this.orbitcontrols.update(dt);
  };
}

export default OrbitControl;
