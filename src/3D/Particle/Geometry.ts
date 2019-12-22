import {
  BufferAttribute,
  InstancedBufferAttribute,
  InstancedBufferGeometry
} from "three";

export enum AttributeName {
  position = "position",
  uv = "uv",
  sprite = "sprite",
  size = "size",
  translate = "translate",
  color = "color",
  opacity = "opacity",
  id = "id",
  tob = "tob",
  lifespan = "lifespan"
}

const arrPos = [-0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0];
const arrUV = [0, 1, 1, 1, 0, 0, 1, 0];
const arrIndex = [0, 2, 1, 2, 3, 1];

const f32Arr = (length): Float32Array => new Float32Array(length);

const mapUVForSpriteMap = (columns: number, rows: number) => {
  return (v, i) => v / (i % 2 ? rows : columns);
};

export class Geometry extends InstancedBufferGeometry {
  particleCount: number;
  constructor(particleCount: number = 1024) {
    super();
    this.particleCount = particleCount;
    // Buffer Attributes
    this.setIndex(new BufferAttribute(new Uint16Array(arrIndex), 1));
    this.setAttribute(
      AttributeName.position,
      new BufferAttribute(new Float32Array(arrPos), 3, true)
    );
    this.setAttribute(
      AttributeName.uv,
      new BufferAttribute(new Float32Array(arrUV), 2, true)
    );
    // Instanced Buffer Attrs: custom for each particle
    this.setAttribute(
      AttributeName.sprite,
      new InstancedBufferAttribute(f32Arr(particleCount), 1, false, 1)
    );
    this.setAttribute(
      AttributeName.size,
      new InstancedBufferAttribute(f32Arr(particleCount), 1, false, 1)
    );
    this.setAttribute(
      AttributeName.translate,
      new InstancedBufferAttribute(f32Arr(particleCount * 3), 3, false, 1)
    );
    this.setAttribute(
      AttributeName.color,
      new InstancedBufferAttribute(
        f32Arr(particleCount * 3).fill(1),
        3,
        false,
        1
      )
    );
    this.setAttribute(
      AttributeName.opacity,
      new InstancedBufferAttribute(f32Arr(particleCount).fill(1), 1, true, 1)
    );
    this.setAttribute(
      AttributeName.id,
      new InstancedBufferAttribute(
        f32Arr(particleCount).map((_, i) => i),
        1,
        false,
        1
      )
    );
    this.setAttribute(
      AttributeName.tob,
      new InstancedBufferAttribute(f32Arr(particleCount), 1, false, 1)
    );
    this.setAttribute(
      AttributeName.lifespan,
      new InstancedBufferAttribute(f32Arr(particleCount), 1, false, 1)
    );
  }

  /**
   * if we use a spritemap, we have to change the uvs
   *
   * @param  {number} columns num of columns
   * @param  {number} rows num of rows
   */
  prepareSpritemaps(columns: number, rows: number): void {
    const attrUV = this.getAttribute(AttributeName.uv) as BufferAttribute;
    attrUV.copyArray(
      (attrUV.array as number[]).map(mapUVForSpriteMap(columns, rows))
    );
  }
}
