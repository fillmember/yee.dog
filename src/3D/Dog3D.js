import { MeshLambertMaterial, LinearEncoding } from "three";
import { Animation } from "./Animation.js";

export default class Dog3D {
  constructor({ obj3d, scene }) {
    const mesh = (this.mesh = obj3d);
    // correct material
    mesh.material.map.encoding = LinearEncoding;
    const mat = new MeshLambertMaterial({
      color: 0x444444,
      map: mesh.material.map,
      skinning: true,
      emissive: 0xffffff,
      emissiveMap: mesh.material.map
    });
    mesh.material = mat;
    // Animation
    this.animation = new Animation(this.mesh);
  }
  update(dt) {
    this.animation.update(dt);
  }
}
