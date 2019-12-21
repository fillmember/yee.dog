import { useMemo } from "react";
import random from "lodash/random";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isFunction from "lodash/isFunction";
import { Vector3, BufferAttribute } from "three";
import { Geometry } from "../../3D/Particle";
import { NumberTriplet } from "../utils";

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

const defaultVelocity: NumberTriplet = [0, 1, 0];

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

export function setAttribute(
  geometry: Geometry,
  name: string,
  values: number[],
  particleIndex: number
): void {
  const attribute = geometry.getAttribute(name) as BufferAttribute;
  attribute.set(values, particleIndex);
}

export const useEmitter = (options: EmitterOptions): Function => {
  const { enabled = true, rate = 4 } = options;
  const emitInterval = useMemo(
    () => (enabled && rate > 0 ? 1 / rate : Infinity),
    [enabled, rate]
  );
  const fn = useMemo(() => {
    let t = 0;
    let particleIndex = 0;
    return function(
      geometry: Geometry,
      acc: number[],
      vel: number[],
      elapsedTime: number,
      delta: number
    ) {
      t += delta;
      if (t > emitInterval) {
        const {
          position,
          sprite,
          size,
          lifespan,
          velocity,
          acceleration
        } = options;
        const arrIndex = particleIndex * 3;
        const [x, y, z] = [arrIndex, arrIndex + 1, arrIndex + 2];
        [acc[x], acc[y], acc[z]] = getVec3(acceleration);
        [vel[x], vel[y], vel[z]] = getVec3(velocity, defaultVelocity);
        setAttribute(geometry, "translate", getVec3(position), particleIndex);
        setAttribute(geometry, "sprite", [getNumber(sprite)], particleIndex);
        setAttribute(geometry, "size", [getNumber(size, 1)], particleIndex);
        setAttribute(
          geometry,
          "lifespan",
          [getNumber(lifespan, 1)],
          particleIndex
        );
        setAttribute(geometry, "tob", [elapsedTime], particleIndex);
        particleIndex = (particleIndex + 1) % geometry.particleCount;
        t = 0;
      }
    };
  }, []);
  return fn;
};
