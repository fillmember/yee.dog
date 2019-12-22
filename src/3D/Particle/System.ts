import { BufferAttribute, BufferGeometry } from "three";
import { Mesh } from "./Mesh";
import { Geometry, AttributeName as GAttributeName } from "./Geometry";
import { BillboardMaterial } from "./BillboardMaterial";

export enum SystemAttributeName {
  velocity = "velocity",
  acceleration = "acceleration"
}
export type AttributeName = GAttributeName | SystemAttributeName;

export class System extends Mesh {
  iter = 0;
  forces = [];
  emitters = [];
  attributes: Record<SystemAttributeName, Float32Array>;

  get particleCount() {
    return (this.geometry as Geometry).particleCount;
  }
  constructor(geometry, material) {
    super(geometry, material);
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
  setParticle(
    iter: number,
    translate: [number, number, number],
    options: Record<string, number | number[]> = {}
  ) {
    this.setAttribute(GAttributeName.translate, iter, translate);
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
  setAttribute(name: string, iter: number, values: number | number[]) {
    if (!(values instanceof Array)) values = [values];
    var offset = iter * values.length;
    var attribute = this.getAttributeArray(name) as number[];
    values.forEach((v, i) => (attribute[offset + i] = v));
  }

  /* more low level, use this if you know what you are doing */
  /**
   * returns the raw typed array for the attribute. Dirty flag will be set for you
   *
   * @param {String} name attribute name
   * @return {typed Array} the raw attribute array
   */
  getAttributeArray(name: string): ArrayLike<number> | Float32Array {
    if (this.attributes[name]) return this.attributes[name];
    var attribute = (this.geometry as BufferGeometry).getAttribute(
      name
    ) as BufferAttribute;
    attribute.needsUpdate = true;
    return attribute.array;
  }

  updateEmittors(elapsedTime: number, dt: number): void {
    this.emitters.forEach(emitter => emitter.update(this, elapsedTime, dt));
  }

  updateEffectors(): void {
    const max = this.particleCount * 3;
    const translations = this.getAttributeArray(GAttributeName.translate);
    this.forces.forEach(force => {
      for (var i3 = 0; i3 < max; i3 += 3) {
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
    const attr = (this.geometry as Geometry).getAttribute(
      GAttributeName.translate
    ) as BufferAttribute;
    this.attributes.acceleration.forEach((a, i) => {
      this.attributes.velocity[i] += a;
      attr.set([attr.array[i] + this.attributes.velocity[i]], i);
    });
  }

  update(elapsedTime, dt) {
    this.updateEmittors(elapsedTime, dt);
    this.updateEffectors();
    this.updateSystemAttributes();
    (this.material as BillboardMaterial).uniforms.time.value = elapsedTime;
  }
}
