import { MathUtils } from "three";

export const rad = (v) => v * MathUtils.DEG2RAD;
export const arrOf = (val = 0, len = 2) => new Array(len).fill(val);
export const negate = (v) => v * -1;
