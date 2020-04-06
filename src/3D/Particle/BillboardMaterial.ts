import {
  ShaderMaterial,
  Texture,
  ShaderMaterialParameters,
  IUniform
} from "three";

type Props = {
  texture?: Texture;
  columns?: number;
  rows?: number;
} & ShaderMaterialParameters;

/**
 * Material for the Particle System
 *
 * @class Material
 */
export class BillboardMaterial extends ShaderMaterial {
  columns: number;
  rows: number;
  constructor({ uniforms = {}, texture, columns = 1, rows = 1 }: Props) {
    super({
      vertexShader,
      fragmentShader,
      defines: {
        AGE: true
      },
      uniforms: {
        time: { value: 1.0 },
        texture: { value: texture },
        ...uniforms
      },
      transparent: true,
      depthWrite: false
    });
    this.columns = columns;
    this.rows = rows;
  }
}

export const vertexShader = `
  attribute float size;
  attribute vec3 translate;
  attribute float sprite;
  attribute float opacity;
  attribute vec3 color;
  attribute float id;
  attribute float tob;
  attribute float lifespan;

  uniform vec2 spritemap;
  uniform float time;

  varying float vOpacity;
  varying vec3 vColor;
  varying vec2 vUv;

  void main() {


    #ifdef SPRITEMAP
      vec2 coords = vec2( mod( sprite, spritemap.x ), floor( sprite / spritemap.y ) );
      vUv = uv + vec2(1,1) / spritemap * coords;
    #else
      vUv = uv;
    #endif

    float age = (time - tob) / lifespan;
    vColor = color;
    if (age > 1.0) {
      vOpacity = opacity * mix( 1.0 , 0.0 , (age - 1.0) * 10.0 );
    } else {
      vOpacity = opacity * mix( 0.0 , 1.0 , (time-tob) * 10.0 );
    }

    float radius = 0.05;
    float speed = ( 0.2 + mod(id, 8.0) / 10.0 ) * 5.0;
    float progress = time * speed + id;

    vec3 mtrans = vec3(
      translate.x + sin( progress ) * radius,
      translate.y + sin( progress * speed / 5.0 ) * radius,
      translate.z + cos( progress ) * radius
    );

    vec4 mvPosition = modelViewMatrix * vec4( translate, 1.0 );
    mvPosition.xyz += position * size; // * ( sin(time + id) + 1.5 );

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  uniform sampler2D texture;
  varying vec2 vUv;
  varying vec3 vColor;
  varying float vOpacity;
  void main() {
    #ifdef TEXTURE
      gl_FragColor = vec4( vColor, vOpacity ) * texture2D( texture, vUv );
    #else
      gl_FragColor = vec4( vColor, vOpacity );
    #endif
  }
`;
