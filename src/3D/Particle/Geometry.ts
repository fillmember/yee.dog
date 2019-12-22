import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry
} from "three";

const arrPos = [-0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0];
const arrUV = [0, 1, 1, 1, 0, 0, 1, 0];
const arrIndex = [0, 2, 1, 2, 3, 1];

export class Geometry extends InstancedBufferGeometry {
  particleCount: number;
  constructor(particleCount: number = 1024) {
    super();
    this.particleCount = particleCount;
    const indexes = new Uint16Array(arrIndex);
    const positions = new Float32Array(arrPos);
    const uvs = new Float32Array(arrUV);
    const translations = new Float32Array(particleCount * 3);
    const sprites = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    const opacities = new Float32Array(particleCount).fill(1);
    const colors = new Float32Array(particleCount * 3).fill(1);
    const ids = new Float32Array(particleCount).map((_, i) => i);
    const lifespans = new Float32Array(particleCount);
    const tobs = new Float32Array(particleCount);
    this.setIndex(new BufferAttribute(indexes, 1));
    this.setAttribute("position", new BufferAttribute(positions, 3, true));
    this.setAttribute("uv", new BufferAttribute(uvs, 2, true));
    /* custom for every particle */
    this.setAttribute(
      "sprite",
      new InstancedBufferAttribute(sprites, 1, false, 1)
    );
    this.setAttribute("size", new InstancedBufferAttribute(sizes, 1, false, 1));
    this.setAttribute(
      "translate",
      new InstancedBufferAttribute(translations, 3, false, 1)
    );
    this.setAttribute(
      "color",
      new InstancedBufferAttribute(colors, 3, false, 1)
    );
    this.setAttribute(
      "opacity",
      new InstancedBufferAttribute(opacities, 1, true, 1)
    );
    this.setAttribute("id", new InstancedBufferAttribute(ids, 1, false, 1));
    this.setAttribute("tob", new InstancedBufferAttribute(tobs, 1, false, 1));
    this.setAttribute(
      "lifespan",
      new InstancedBufferAttribute(lifespans, 1, false, 1)
    );
  }

  /**
   * if we use a spritemap, we have to change the uvs
   *
   * @param  {number} columns num of columns
   * @param  {number} rows num of rows
   * @param  {boolean} prepareGeometry set tro to change geometry (proportions), too
   */
  prepareSpritemaps(columns, rows) {
    const attrUV = this.getAttribute("uv");
    for (let i = 0; i < attrUV.count; i++) {
      attrUV.array[i * 2 + 0] /= columns;
      attrUV.array[i * 2 + 1] /= rows;
    }
  }
}
