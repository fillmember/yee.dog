import { Clock } from "three";
import { Mesh } from "./Mesh.js";
import { Geometry } from "./Geometry.js";
import { BillboardMaterial } from "./BillboardMaterial.js";

/**
 * physics enabled particle system
 */
export class System extends Mesh {
  constructor(geometry, material) {
    if (typeof geometry === "number") {
      geometry = new Geometry(geometry);
      material = new BillboardMaterial();
    }
    super(geometry, material);

    this.particleCount = geometry.particleCount;
    this.iter = 0;
    this.speed = 1;

    this.material.defines.AGE = true;

    this.clock = new Clock();
    this.clock.start();

    this.velocities = new Float32Array(this.particleCount * 3);
    this.accelerations = new Float32Array(this.particleCount * 3);

    this.attributes = {
      velocity: this.velocities,
      acceleration: this.accelerations
    };

    this.forces = [];
    this.emitters = [];
  }

  addForce(force) {
    force.system = this;
    this.forces.push(force);
  }

  addEmitter(emitter) {
    emitter.system = this;
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
    options.tob = options.tob || this.clock.getElapsedTime();
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
    /* if the position is a Vector, convert it to an array */
    if (translate.isVector3) translate = translate.toArray();
    options.translate = translate;

    /* by default we set size to 1*/
    if (options.size === undefined) options.size = 1.0;

    /* set all the attributes */
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

    for (var i = 0; i < values.length; i++) {
      attribute[offset + i] = values[i];
    }
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

  _tickEmitter(dt) {
    var translations = this.getAttributeArray("translate");
    this.emitters.forEach(emitter => {
      emitter.tick(dt);
      for (var i3 = 0; i3 < this.particleCount * 3; i3 += 3) {
        emitter.influence(
          i3,
          translations,
          this.velocities,
          this.accelerations
        );
      }
    });
  }

  _tickPhysics() {
    var translations = this.getAttributeArray("translate");
    this.forces.forEach(force => {
      for (var i3 = 0; i3 < this.particleCount * 3; i3 += 3) {
        force.influence(i3, translations, this.velocities, this.accelerations);
      }
    });
  }

  _tickMove() {
    var translations = this.getAttributeArray("translate");
    for (var i = 0; i < this.particleCount * 3; i++) {
      this.velocities[i] += this.accelerations[i];
      translations[i] += this.velocities[i];
    }
  }

  update(dt) {
    this._tickEmitter(dt);
    this._tickPhysics(dt);
    this._tickMove(dt);
    this.material.uniforms.time.value = this.clock.getElapsedTime();
  }
}
