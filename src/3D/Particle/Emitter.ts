import random from "lodash/random";
import memoize from "lodash/memoize";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import { AttributeName } from "./Geometry";
import { NumberTriplet } from "./types";
type FunctionsReturning<T> = () => T;
type EmitterOptionProperty<T> = T | T[] | FunctionsReturning<T>;
export type EmitterOptions = {
  enabled?: boolean;
  rate?: number;
  size?: EmitterOptionProperty<number>;
  sprite?: EmitterOptionProperty<number>;
  lifespan?: EmitterOptionProperty<number>;
  position?: EmitterOptionProperty<NumberTriplet>;
  velocity?: EmitterOptionProperty<NumberTriplet>;
  acceleration?: EmitterOptionProperty<NumberTriplet>;
};

const defaultOptions = {
  enabled: true,
  rate: 4,
  size: 1,
  sprite: 0,
  lifespan: 1,
  position: [0, 0, 0],
  velocity: [0, 0.1, 0],
  acceleration: [0, 0, 0]
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
  public enabled: boolean;
  public rate: number;
  public size?: EmitterOptionProperty<number>;
  public sprite?: EmitterOptionProperty<number>;
  public lifespan?: EmitterOptionProperty<number>;
  public position?: EmitterOptionProperty<NumberTriplet>;
  public velocity?: EmitterOptionProperty<NumberTriplet>;
  public acceleration?: EmitterOptionProperty<NumberTriplet>;
  private t: number = 0;
  constructor(options: EmitterOptions = {}) {
    Object.keys(defaultOptions).forEach(key => {
      this[key] = options[key] || defaultOptions[key];
    });
  }
  update(system, elapsedTime, dt) {
    this.t += dt;
    if (this.t > computeInterval(this.enabled, this.rate)) {
      this.emit(system, elapsedTime);
      this.t = 0;
    }
  }
  emit(system, elapsedTime) {
    const { velocity, acceleration, position, sprite, size, lifespan } = this;
    const {
      attributes: { velocity: attrVel, acceleration: attrAcc }
    } = system;
    // finally
    const i = system.iter * 3;
    const [x, y, z] = [i, i + 1, i + 2];
    [attrVel[x], attrVel[y], attrVel[z]] = getVec3(velocity);
    [attrAcc[x], attrAcc[y], attrAcc[z]] = getVec3(acceleration);
    system.addParticle(getVec3(position), {
      [AttributeName.sprite]: getNumber(sprite, defaultOptions.sprite),
      [AttributeName.size]: getNumber(size, defaultOptions.size),
      [AttributeName.lifespan]: getNumber(lifespan, defaultOptions.lifespan),
      [AttributeName.tob]: elapsedTime
    });
  }
}
