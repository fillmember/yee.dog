import { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { useDogBones } from "../hooks/useDogBone";
import { rad, lerp } from "../utils/functional";
import { emit } from "../DogEvent";

export const DogBark: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const [jawL, jawU] = useDogBones(["JawL_0", "JawU_0"]);
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const onMouseDown = () => {
      setMouseDown(true);
      emit("bark", true);
    };
    const onMouseUp = () => {
      setMouseDown(false);
      emit("bark", false);
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchstart", onMouseDown);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchstart", onMouseDown);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [enabled]);
  useFrame(() => {
    if (!enabled) return;
    jawU.rotation.x = lerp(
      jawU.rotation.x,
      rad(mouseDown ? -29 : -30.816),
      0.5
    );
    jawL.rotation.x = lerp(
      jawL.rotation.x,
      rad(mouseDown ? -60 : -32.587),
      0.5
    );
  });
  return null;
};
