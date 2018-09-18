"use strict";

/**
 * Simple Particle System
 * @author Dennis Timmermann
 *
 * TODO:
 *  add z-sorting
 *  respect normals
 */

export { Geometry } from "./Geometry.js";
export { Mesh } from "./Mesh.js";
export { System } from "./System.js";
export { Force } from "./Force.js";
import * as _Actors from "./Actors.js";
export const Actors = _Actors;
export {
  BillboardMaterial,
  fragmentShader,
  vertexShader
} from "./BillboardMaterial";
export { Emitter } from "./Emitter.js";
