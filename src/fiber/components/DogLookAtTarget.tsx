import { useFrame } from "react-three-fiber";
import { useMemo, useState } from "react";
import { Vector3 } from "three";
import throttle from "lodash/throttle";
type Props = {
  children: (pos: number[]) => JSX.Element;
  debug?: boolean;
};
export const DogLookAtTarget = ({ debug = false, children }: Props) => {
  const [pos, setPos] = useState<number[]>([0, 0, 0]);
  const v1 = useMemo(() => new Vector3(), []);
  useFrame(
    throttle(({ camera, mouse }) => {
      v1.set(mouse.x, mouse.y, 0.5)
        .unproject(camera)
        .sub(camera.position)
        .normalize()
        .multiplyScalar(6);
      setPos(v1.add(camera.position).toArray() as number[]);
    }, 50)
  );
  return (
    <>
      {debug && (
        <mesh position={pos}>
          <boxBufferGeometry attach="geometry" args={[0.2, 0.2, 0.2]} />
          <meshNormalMaterial attach="material" />
        </mesh>
      )}
      {children(pos)}
    </>
  );
};
