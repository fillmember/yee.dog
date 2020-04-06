import { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { useDogBones } from "../hooks/useDogBone";
import { rad, lerp } from "../utils/functional";
import { emit } from "../DogEvent";

export const DogBark = () => {
  const [jawL, jawU] = useDogBones(["JawL_0", "JawU_0"]);
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    const onMouseDown = (evt) => {
      setMouseDown(true);
      emit("bark", true);
    };
    const onMouseUp = () => {
      setMouseDown(false);
      emit("bark", false);
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  useFrame(() => {
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
