import { useMemo } from "react";
import { TextureLoader, NearestFilter, Vector2 } from "three";
import { useLoader } from "react-three-fiber";
import { BillboardMaterial } from "../../3D/Particle";

export const useMaterial = url => {
  const columns = 8;
  const rows = 8;
  const img = useLoader(TextureLoader, url);
  const material = useMemo<BillboardMaterial>(
    () =>
      new BillboardMaterial({
        texture: img,
        depthWrite: false,
        transparent: true,
        uniforms: {
          spritemap: {
            type: "v2",
            value: new Vector2(columns, rows)
          }
        },
        rows,
        columns
      }),
    [img]
  );
  material.defines.TEXTURE = true;
  material.defines.SPRITEMAP = true;
  material.uniforms.texture.value.minFilter = NearestFilter;
  material.uniforms.texture.value.magFilter = NearestFilter;

  return material;
};
