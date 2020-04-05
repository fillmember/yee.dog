import { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import { useDogBones } from "../hooks/useDogBone";
import { rad, lerp } from "../utils/functional";

export const DogBark = () => {
  const [head, jawL, jawU] = useDogBones(["Head", "JawL_0", "JawU_0"]);
  const [mouseDown, setMouseDown] = useState(false);
  const [consent, accept] = useState(false);
  useEffect(() => {
    const onMouseDown = (evt) => {
      accept(true);
      setMouseDown(true);
      head.rotateX(0.1);
    };
    const onMouseUp = () => {
      setMouseDown(false);
    };
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);
  useFrame(() => {
    head.position.y = lerp(head.position.y, mouseDown ? 10 : 0, 0.5);
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
