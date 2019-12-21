import random from "lodash/random";
import { Vector3 } from "three";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import { System } from "./System";

type NumberTriplet = [number, number, number];
type FunctionsReturning<T> = () => T;
type EmitterOptionProperty<T> = T | T[] | FunctionsReturning<T>;
type EmitterOptions = {
  enabled?: boolean;
  rate?: number;
  size?: EmitterOptionProperty<number>;
  sprite?: EmitterOptionProperty<number>;
  lifespan?: EmitterOptionProperty<number>;
  position?: EmitterOptionProperty<NumberTriplet>;
  velocity?: EmitterOptionProperty<NumberTriplet>;
  acceleration?: EmitterOptionProperty<NumberTriplet>;
};

function getNumber(input, defaultValue = 0): number {
  if (isNumber(input)) return input;
  if (isFunction(input)) return input();
  if (isArray(input)) return input[random(0, input.length - 1)];
  return defaultValue;
}

function getVec3(
  input,
  defaultValue: NumberTriplet = [0, 0, 0]
): NumberTriplet {
  if (isArray(input)) return input;
  if (isFunction(input)) return input();
  if (isNumber(input)) return [input, input, input];
  return defaultValue;
}

export class Emitter {
  config: EmitterOptions;
  system: any;
  _lastTime: any;
  constructor(config: EmitterOptions) {
    this.config = config;
  }
  update() {
    if (this.config.rate === 0 || this.config.enabled === false) {
      return;
    }
    const now = this.system.clock.getElapsedTime();
    const deltaTime = now - this._lastTime;
    const cooldownTime = this.config.rate > 0 ? 1 / this.config.rate : Infinity;
    if (deltaTime > cooldownTime || isNaN(deltaTime)) {
      this.emitParticle();
      this._lastTime = now;
    }
  }
  emitParticle() {
    const {
      config: { velocity, acceleration, position, sprite, size, lifespan },
      system
    } = this;
    const {
      system: { velocities, accelerations }
    } = this;
    // finally
    const i = system.iter * 3;
    const [x, y, z] = [i, i + 1, i + 2];
    [velocities[x], velocities[y], velocities[z]] = getVec3(velocity);
    [accelerations[x], accelerations[y], accelerations[z]] = getVec3(
      acceleration
    );
    system.addParticle(getVec3(position), {
      sprite: getNumber(sprite, 0),
      size: getNumber(size, 1),
      lifespan: getNumber(lifespan, 1)
    });
  }
}
