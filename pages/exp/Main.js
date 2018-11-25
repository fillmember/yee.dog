import React, { Fragment } from "react";
import Stage3D from "./Stage3D";
import { useWindowSize } from "react-use";

class Camera extends React.Component {
  static contextType = "stage3D";
  render() {
    console.log(this);
    return false;
  }
}

const OrbitControl = () => false;
const Dog3D = () => false;
const IKChain = () => false;

export default props => {
  const windowSize = useWindowSize();
  return (
    <Fragment>
      <Stage3D {...windowSize} clearColor={0x1b8547}>
        <Camera fov={22} near={0.01} far={10000} position={[-20, 2, -20]} />
        <OrbitControl
          autoRotate={true}
          autoRotateSpeed={0.033}
          enableDamping={true}
          rotateSpeed={0.3}
          dampingFactor={0.1}
          enablePan={false}
          enableZoom={false}
        />
        <Dog3D path="/static/model/wt" mesh="Wurstgang">
          <IKChain name="look" target={[0, 0, 0]} />
        </Dog3D>
      </Stage3D>
    </Fragment>
  );
};
