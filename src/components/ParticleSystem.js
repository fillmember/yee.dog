import { Texture, NearestFilter, Math as Math3 } from "three";
import {
  Emitter,
  System,
  Geometry,
  BillboardMaterial
} from "./Particle/index.js";
import { TweenMax, Elastic } from "gsap";
import PARTICLE_TEXTURE from "./particle_tex_0.png";

export default class ParticleSystems {
  constructor(configs) {
    this.createTexture();
    //
    this.systems = {};
    Object.keys(configs).forEach(key => {
      const config = configs[key];
      const system = (this.systems[key] = new System(
        new Geometry(config.max),
        this.material
      ));
      system.addEmitter(new Emitter(config.emitter));
      config.parent.add(system);
    });
  }
  createTexture() {
    this.texture = new Texture();
    this.texture.minFilter = NearestFilter;
    this.texture.magFilter = NearestFilter;
    this.material = new BillboardMaterial({
      texture: this.texture,
      transparent: true,
      depthWrite: false,
      columns: 8,
      rows: 8
    });
    // preload
    this.texture.image = new Image();
    this.texture.image.onload = () => {
      this.texture.needsUpdate = true;
      this.material.needsUpdate = true;
    };
    this.texture.image.src = PARTICLE_TEXTURE;
  }
  update(dt) {
    Object.keys(this.systems).forEach(key => {
      const system = this.systems[key];
      if (system.visible) {
        system.update(dt);
      }
    });
  }
}
