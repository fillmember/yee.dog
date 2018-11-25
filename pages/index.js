import React from "react";
import isEqual from "lodash/isEqual";

import "./../src/css/reset.css";
import "./../src/css/basic.css";

import DogStore from "../src/DogStore";

import App from "../src/App";

import resize from "../src/behaviours/resize";
import orbitcontrol from "../src/behaviours/orbitcontrol";
import baseAnimationBark from "../src/behaviours/bark";
import baseAnimationWag from "../src/behaviours/wag";
import baseAnimationVleg from "../src/behaviours/vleg";
import baseAnimationEarWagL from "../src/behaviours/earWagL";
import baseAnimationEarWagR from "../src/behaviours/earWagR";
import baseIK from "../src/behaviours/baseIK";
import baseMouseTo3D from "../src/behaviours/baseMouseTo3D";
import petTheDog from "../src/behaviours/petTheDog";
import ikTargetToMouse from "../src/behaviours/ikTargetToMouse";
import BoneID from "../src/3D/BoneID";

class Behaviour extends React.Component {
  behaviour = null;
  getArguments(obj = this.props) {
    const { value, ...others } = obj;
    return others;
  }
  updateBehaviour() {
    const others = this.getArguments();
    const args = Object.keys(others);
    args.forEach(key => {
      this.behaviour.set(key, others[key]);
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.value !== this.props.value) {
      console.warn("don't change behaviour on the fly!");
    }
    if (!isEqual(this.getArguments(prevProps), this.getArguments())) {
      this.updateBehaviour();
    }
  }
  componentDidMount() {
    const Behaviour = this.props.value;
    this.behaviour = new Behaviour();
    this.updateBehaviour();
    DogStore.addBehaviour(this.behaviour);
  }
  render() {
    return false;
  }
}

export default () => (
  <App>
    <Behaviour value={resize} />
    <Behaviour value={orbitcontrol} />
    <Behaviour value={baseMouseTo3D} />
    <Behaviour value={baseAnimationBark} useMouse={true} />
    <Behaviour value={baseAnimationWag} />
    <Behaviour value={baseAnimationEarWagL} />
    <Behaviour value={baseAnimationEarWagR} />
    <Behaviour value={baseAnimationVleg} useMouse={true} />
    <Behaviour
      value={baseIK}
      chains={{
        worm: {
          joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck, BoneID.Head],
          constraints: [40, 15, 10, 5],
          influence: 0.1,
          clipWeight: 0.5
        },
        look: {
          joints: [BoneID.Shoulder, BoneID.Neck, BoneID.Head],
          constraints: [10, 40, 30],
          influence: 0.1,
          clipWeight: 1
        }
      }}
    />
    <Behaviour value={ikTargetToMouse} chain={"worm"} />
    <Behaviour value={ikTargetToMouse} chain={"look"} />
    <Behaviour
      value={petTheDog}
      transitionDuration={0.5}
      targetWeight={0.6}
      action={"earWagL"}
      bone={[BoneID.EarL_0, BoneID.EarL_1, BoneID.EarL_1]}
    />
    <Behaviour
      value={petTheDog}
      transitionDuration={0.5}
      targetWeight={0.6}
      action={"earWagR"}
      bone={[BoneID.EarR_0, BoneID.EarR_1, BoneID.EarR_1]}
    />
  </App>
);
