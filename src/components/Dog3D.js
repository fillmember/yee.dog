import { MeshLambertMaterial, LinearEncoding } from "three";
import { IKSolver } from "./IK.js";
import { Animation } from "./Animation.js";
import BoneID from "./BoneID.js";
import { DOG_BARK_START, DOG_BARK_END } from "./Events.js";

export default class Dog3D {
  constructor({ obj3d, scene }) {
    const dog = (this.dog = obj3d);
    // correct material
    dog.material.map.encoding = LinearEncoding;
    const mat = new MeshLambertMaterial({
      color: 0x444444,
      map: dog.material.map,
      skinning: true,
      emissive: 0xffffff,
      emissiveMap: dog.material.map
    });
    dog.material = mat;
    dog.position.y = -0.4;
    // IK
    this.ik = new IKSolver();
    this.ik.init({
      scene,
      mesh: dog,
      chains: {
        worm: {
          joints: [5, 6, 7, 8],
          constraints: [0, 0, 0],
          influence: 1
        },
        look: { joints: [7, 8], constraints: [0, 0, 0], influence: 0.0 }
      }
    });
    // Animation
    this.animation = new Animation(dog);
  }
  update() {
    this.ik.update();
    // this.animation.update();
  }
  get position() {
    return this.dog.position;
  }
  get rotation() {
    return this.dog.rotation;
  }
  get scale() {
    return this.dog.scale;
  }
  set debug(v) {
    this.solver.debug = v;
    this.dog.material.wireframe = v;
  }
}
