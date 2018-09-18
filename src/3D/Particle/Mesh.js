import { Vector2, Mesh as THREEMesh } from "three";

/**
 * Particle Mesh, prepares geometry and material
 */
export class Mesh extends THREEMesh {
  constructor(geometry, material) {
    /* set up material */
    /* defines and uniforms */
    // material.defines = material.defines || {}
    if (material.uniforms.texture) material.defines.TEXTURE = true;

    if (material.rows > 1 || material.columns > 1) {
      material.defines.SPRITEMAP = true;
      material.uniforms.spritemap = {
        type: "v2",
        value: new Vector2(material.columns, material.rows)
      };

      geometry.prepareSpritemaps(material.columns, material.rows);
    }

    super(geometry, material);
    this.frustumCulled = false;
  }
}
