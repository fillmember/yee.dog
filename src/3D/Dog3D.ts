import { MeshLambertMaterial, LinearEncoding } from "three";
import { Animation } from "./Animation";

export default class Dog3D {
  mesh: any;
  animation: any;
  constructor({ obj3d }) {
    this.mesh = obj3d;
    this.animation = new Animation(this.mesh);
    // correct material
    const { mesh } = this;
    mesh.material.map.encoding = LinearEncoding;
    const mat = new MeshLambertMaterial({
      color: 0x444444,
      map: mesh.material.map,
      skinning: true,
      emissive: 0xffffff,
      emissiveMap: mesh.material.map
    });
    mesh.material = mat;
  }
  update(dt) {
    this.animation.update(dt);
  }
}
