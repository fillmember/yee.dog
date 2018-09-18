import { Vector3, Math as Math3 } from "three";

const getType = function(elem) {
  return Object.prototype.toString.call(elem).slice(8, -1);
};

const getNumber = function(input, defaultValue = 0, fnArgs) {
  switch (getType(input)) {
    case "Array":
      return input[Math3.randInt(0, input.length - 1)];
    case "Number":
      return input;
    case "Function":
      return input(fnArgs);
    default:
      return defaultValue;
  }
};

const getVec3 = function(input, defaultValue = [0, 0, 0], fnArgs) {
  switch (getType(input)) {
    case "Array":
      return input;
    case "Number":
      return new Array(3).fill(input);
    case "Function":
      return input(fnArgs);
    default:
      return defaultValue;
  }
};

export class Emitter {
  constructor(config) {
    this.config = config;
  }
  tick() {
    const now = this.system.clock.getElapsedTime();
    const deltaTime = now - this._lastTime;
    const cooldownTime = this.config.rate > 0 ? 1 / this.config.rate : Infinity
    if (deltaTime > cooldownTime || isNaN(deltaTime)) {
      this.emitParticle();
      this._lastTime = now;
    }
  }
  emitParticle() {
    // determine position
    let position = this.config.center.isObject3D
      ? this.config.center.getWorldPosition(new Vector3()).toArray()
      : this.config.center.isVector3
        ? this.config.center.toArray()
        : getVec3(this.config.center);
    const extent = getVec3(this.config.extent);
    const offset = getVec3(this.config.offset);
    position = position.map(
      (v, i) => v + offset[i] + extent[i] * Math3.randFloat(-1, 1)
    );
    // determine options
    const options = {
      sprite: getNumber(this.config.sprite, 0, this),
      size: getNumber(this.config.size, 1, this),
      lifespan: getNumber(this.config.lifespan, 1)
    };
    // finally
    const velocity = getVec3(this.config.velocity);
    const i = this.system.iter * 3;
    this.system.velocities[i] = velocity[0];
    this.system.velocities[i + 1] = velocity[1];
    this.system.velocities[i + 2] = velocity[2];
    this.system.addParticle(position, options);
  }
  // eslint-disable-next-line
  influence(iter, pos, v, a) {}
}
