import { useEffect, useState } from "react";
import { useFrame } from "react-three-fiber";
import useSound from "use-sound";
import { useDogBones } from "../hooks/useDogBone";
import { rad, lerp } from "../utils/functional";
import { emit } from "../DogEvent";

export const DogBark: React.FC<{ enabled?: boolean }> = ({
  enabled = true,
}) => {
  const [playSound] = useSound("/static/sound/bark.mp3", {
    interrupt: true,
  });
  const [jawL, jawU, head] = useDogBones(["JawL_0", "JawU_0", "Head"]);
  const [mouseDown, setMouseDown] = useState(false);
  useEffect(() => {
    if (mouseDown) {
      playSound();
    }
  }, [mouseDown]);
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
    if (mouseDown) {
      head.rotation.x = lerp(head.rotation.x, rad(60), 0.1);
    }
  });
  return null;
};
