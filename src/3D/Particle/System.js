import { Clock, Material } from "three";
import { Mesh } from "./Mesh";
import { Geometry } from "./Geometry";
import { BillboardMaterial } from "./BillboardMaterial";

export class System extends Mesh {
  particleCount;
  iter = 0;
  forces = [];
  emitters = [];
  velocities;
  accelerations;
  attributes;
  constructor(geometry, material) {
    super(geometry, material);
    this.particleCount = geometry.particleCount;
    this.attributes = {
      velocity: new Float32Array(this.particleCount * 3),
      acceleration: new Float32Array(this.particleCount * 3)
    };
  }

  addForce(force) {
    this.forces.push(force);
  }

  addEmitter(emitter) {
    this.emitters.push(emitter);
  }

  /**
   * add particles. The only necessary argument is the position.
   * through otions you can specify the other attributes
   *
   * @param {Array | THREE.Vector3} translate the position of the particle
   * @param {Object} options options array containing settings for attributes
   */
  addParticle(translate, options = {}) {
    this.setParticle(this.iter, translate, options);
    this.iter = (this.iter + 1) % (this.particleCount - 1);
  }

  /**
   * set position and options of particle NUM
   *
   * @param {number} iter index of particle, 0..particleCount
   * @param {array|THREE.Vector3} translate x y and z components of particle position
   * @param {Object} options  other attributes of particle
   */
  setParticle(iter, translate, options = {}) {
    for (var prop in options) {
      this.setAttribute(prop, iter, options[prop]);
    }
  }

  /**
   * set single namend attribute at single position. The attribute width will be infered from the amount of arguments supplied
   *
   * @param {String} name Attribute name
   * @param {Integer} iter which particle, 0..particleCount
   * @param {Number|Array of Numbers} values attribute values
   */
  setAttribute(name, iter, values) {
    if (!(values instanceof Array)) values = [values];
    var offset = iter * values.length;
    var attribute = this.getAttributeArray(name);
    values.forEach((v, i) => (attribute[offset + i] = v));
  }

  /* more low level, use this if you know what you are doing */
  /**
   * returns the raw typed array for the attribute. Dirty flag will be set for you
   *
   * @param {String} name attribute name
   * @return {typed Array} the raw attribute array
   */
  getAttributeArray(name) {
    if (this.attributes[name]) return this.attributes[name];
    var attribute = this.geometry.getAttribute(name);
    attribute.needsUpdate = true;
    return attribute.array;
  }

  updateEmittors(elapsedTime, dt) {
    this.emitters.forEach(emitter => emitter.update(this, elapsedTime, dt));
  }

  updateEffectors() {
    var translations = this.getAttributeArray("translate");
    this.forces.forEach(force => {
      for (var i3 = 0; i3 < this.particleCount * 3; i3 += 3) {
        force.influence(
          i3,
          translations,
          this.attributes.velocity,
          this.attributes.acceleration
        );
      }
    });
  }

  updateSystemAttributes() {
    const translations = this.getAttributeArray("translate");
    for (var i = 0; i < this.particleCount * 3; i++) {
      this.attributes.velocity[i] += this.attributes.acceleration[i];
      translations[i] += this.attributes.velocity[i];
    }
  }

  update(elapsedTime, dt) {
    this.updateEmittors(elapsedTime, dt);
    this.updateEffectors(dt);
    this.updateSystemAttributes();
    this.material.uniforms.time.value = elapsedTime;
  }
}
