import {
  BufferAttribute,
  InstancedBufferAttribute,
  Geometry as THREEGeometry,
  PlaneBufferGeometry,
  InstancedBufferGeometry,
  BufferGeometry
} from "three";

export class Geometry extends InstancedBufferGeometry {
  constructor(
    particleCount = 1024,
    tmpl = new PlaneBufferGeometry(1, 1, 1, 1)
  ) {
    super(); // TODO: do something with normals

    /* setting up the instanced geometry. */

    /* get the meat from the geometry */ var positions, indices, uvs;

    if (tmpl instanceof BufferGeometry) {
      positions = tmpl.getAttribute("position").array;
      indices = tmpl.getIndex().array;
      uvs = tmpl.getAttribute("uv").array;
    }

    // TODO
    else if (tmpl instanceof THREEGeometry) {
      // positions = new Float32Array(tmpl.vertices)
      // indices = tmpl.getIndex().array
      // uvs = tmpl.getAttribute( 'uv' ).array
    }

    /* setting up custom attributes. You can add your own and use them in the vertex shader ...
     * these attributes are custom for every particle, so be ressourceful :D
     * oh yeah ... floats because of WebGL
     * where particles will be translated to ...  * 3 components ( x, y, z ) */
    var translations = new Float32Array(particleCount * 3);
    /* wich sprite to use ...  * 2 components ( column, row )
     * 0..column * row, starting bottom left going to right, growing upwards */
    var sprites = new Float32Array(particleCount);
    /* how big the particle will be ...  * 1 component (size)
     * 0... */
    var sizes = new Float32Array(particleCount);
    /* how visible the particle will be ...  * 1 component (opacity)
     * 0..1 */
    var opacities = new Float32Array(particleCount);
    /* what color to color the particle ...  * 1 component (r, g, b)0..1 */
    var colors = new Float32Array(particleCount * 3);
    /* particle ids ... beacuse WebGL reasons */
    var ids = new Float32Array(particleCount);
    /* particle time of birth ... beacuse WebGL reasons */
    var tobs = new Float32Array(particleCount);
    /* particle time of death */
    var lifespans = new Float32Array(particleCount);
    /* add your own here ... */

    /* typed arrays are initialized with 0, if you want other values, do that here */
    for (var i = 0, i2 = 0, i3 = 0; i < particleCount; i++, i2 += 2, i3 += 3) {
      colors[i3 + 0] = 1.0;
      colors[i3 + 1] = 1.0;
      colors[i3 + 2] = 1.0;

      colors[i3 + 0] = 1.0;
      colors[i3 + 1] = 9.0;
      colors[i3 + 2] = 1.0;

      opacities[i] = 1.0;

      ids[i] = i;
      // ...
    }

    /* add attributes to geometry
     * these attributes are shared for all particles */
    this.setIndex(new BufferAttribute(indices, 1));
    this.addAttribute("position", new BufferAttribute(positions, 3, 1));
    this.addAttribute("uv", new BufferAttribute(uvs, 2, 1));

    /* custom for every particle */
    this.addAttribute(
      "sprite",
      new InstancedBufferAttribute(sprites, 1, false, 1)
    );
    this.addAttribute("size", new InstancedBufferAttribute(sizes, 1, false, 1));
    this.addAttribute(
      "translate",
      new InstancedBufferAttribute(translations, 3, false, 1)
    );
    this.addAttribute(
      "color",
      new InstancedBufferAttribute(colors, 3, false, 1)
    );
    this.addAttribute(
      "opacity",
      new InstancedBufferAttribute(opacities, 1, true, 1)
    );
    this.addAttribute("id", new InstancedBufferAttribute(ids, 1, false, 1));
    this.addAttribute("tob", new InstancedBufferAttribute(tobs, 1, false, 1));
    this.addAttribute(
      "lifespan",
      new InstancedBufferAttribute(lifespans, 1, false, 1)
    );

    this.particleCount = particleCount;
  }

  /**
   * if we use a spritemap, we have to change the uvs
   *
   * @param  {number} columns num of columns
   * @param  {number} rows num of rows
   * @param  {boolean} prepareGeometry set tro to change geometry (proportions), too
   */
  prepareSpritemaps(columns, rows, prepareGeometry = false) {
    /* check if we want to use tiled spritesheets */
    var positions = this.getAttribute("position");
    var uvs = this.getAttribute("uv");

    /* prepare the uvs */
    for (var i2 = 0; i2 < uvs.array.length; i2 += 2) {
      uvs.array[i2 + 0] /= columns;
      uvs.array[i2 + 1] /= rows;
    }

    if (prepareGeometry) {
      /* and the positions */
      for (var i3 = 0; i3 < positions.array.length; i3 += 3) {
        positions.array[i3 + 0] *= rows / columns;
      }
    }
    // recalculationg normals will be harder i guess?

    positions.needsUpdate = true;
    uvs.needsUpdate = true;
  }

  update(dt, stage, time) {
    this.material.uniforms.time.value = time / 5000;

    /* gonna try some physic stuff */
  }
}
