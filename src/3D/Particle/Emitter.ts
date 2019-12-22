import random from "lodash/random";
import memoize from "lodash/memoize";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import { AttributeName } from "./Geometry";
import { NumberTriplet } from "./types";
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

const computeInterval = memoize(
  (enabled, rate) => (enabled && rate > 0 ? 1 / rate : Infinity),
  (enabled, rate) => enabled && rate
);

export class Emitter {
  options: EmitterOptions;
  t: number = 0;
  constructor(options: EmitterOptions) {
    this.options = options;
  }
  update(system, elapsedTime, dt) {
    this.t += dt;
    if (this.t > computeInterval(this.options.enabled, this.options.rate)) {
      this.emit(system, elapsedTime);
      this.t = 0;
    }
  }
  emit(system, elapsedTime) {
    const {
      options: { velocity, acceleration, position, sprite, size, lifespan }
    } = this;
    const {
      attributes: { velocity: attrVel, acceleration: attrAcc }
    } = system;
    // finally
    const i = system.iter * 3;
    const [x, y, z] = [i, i + 1, i + 2];
    [attrVel[x], attrVel[y], attrVel[z]] = getVec3(velocity);
    [attrAcc[x], attrAcc[y], attrAcc[z]] = getVec3(acceleration);
    system.addParticle(getVec3(position), {
      [AttributeName.sprite]: getNumber(sprite, 0),
      [AttributeName.size]: getNumber(size, 1),
      [AttributeName.lifespan]: getNumber(lifespan, 1),
      [AttributeName.tob]: elapsedTime
    });
  }
}
