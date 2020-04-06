import { useEffect } from "react";
import {
  LinearEncoding,
  MeshLambertMaterial,
  MeshStandardMaterial,
} from "three";
import { useDogBones } from "../hooks/useDogBone";
import { useDogContext } from "../context";
import { useFlags } from "../../hooks/useFlags";

export const ModelAdjustment = () => {
  const { debug } = useFlags()
  const bones = useDogBones(["EarL_0", "EarR_0"]);
  useEffect(() => {
    const [earL0,earR0] = bones
    earL0?.scale?.set(1.25,1.35,1.05)
    earR0?.scale?.set(1.25,1.35,1.05)
  },bones)
  const { mesh } = useDogContext();
  useEffect(() => {
    if (!mesh) return;
    const { map } = mesh.material as MeshStandardMaterial;
    map.encoding = LinearEncoding;
    mesh.material = new MeshLambertMaterial({
      skinning: true,
      color: 0x444444,
      map,
      emissive: 0xffffff,
      emissiveMap: map,
      opacity: debug ? 0.8 : 1,
      transparent: !!debug,
    });
  }, [mesh]);
  return null
}
