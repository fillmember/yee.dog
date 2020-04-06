import { Vector2, Mesh as THREEMesh } from "three";
import { Geometry } from "./Geometry";
import { BillboardMaterial } from "./BillboardMaterial";

/**
 * Particle Mesh, prepares geometry and material
 */
export class Mesh extends THREEMesh {
  constructor(geometry: Geometry, material: BillboardMaterial) {
    if (material.uniforms.texture) material.defines.TEXTURE = true;
    if (material.rows > 1 || material.columns > 1) {
      material.defines.SPRITEMAP = true;
      material.uniforms.spritemap = {
        value: new Vector2(material.columns, material.rows)
      };
      geometry.prepareSpritemaps(material.columns, material.rows);
    }
    super(geometry, material);
    this.frustumCulled = false;
  }
}
