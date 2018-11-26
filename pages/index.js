import "./../src/css/reset.css";
import "./../src/css/basic.css";

import React from "react";
import App from "../src/App";

import Behaviour from "../src/behaviours/DoggoBehaviourReact";
import { BehaviourBaseIKInReact } from "../src/behaviours/baseIK";
import petTheDog from "../src/behaviours/petTheDog";
import ikTargetToMouse from "../src/behaviours/ikTargetToMouse";

import BoneID from "../src/3D/BoneID";

export default () => (
  <App>
    <Behaviour value={require("../src/behaviours/resize").default} />
    <Behaviour value={require("../src/behaviours/orbitcontrol").default} />
    <Behaviour value={require("../src/behaviours/baseMouseTo3D").default} />
    <Behaviour
      value={require("../src/behaviours/bark").default}
      useMouse={true}
    />
    <Behaviour value={require("../src/behaviours/wag").default} />
    <Behaviour value={require("../src/behaviours/earWagL").default} />
    <Behaviour value={require("../src/behaviours/earWagR").default} />
    <Behaviour
      value={require("../src/behaviours/vleg").default}
      useMouse={true}
    />
    <Behaviour value={require("../src/behaviours/particleSystem").default} />
    <BehaviourBaseIKInReact />
    <Behaviour value={ikTargetToMouse} chain={"worm"} />
    <Behaviour value={ikTargetToMouse} chain={"look"} />
    <Behaviour
      value={petTheDog}
      action={"earWagL"}
      bone={[BoneID.EarL_0, BoneID.EarL_1, BoneID.EarL_1]}
    />
    <Behaviour
      value={petTheDog}
      action={"earWagR"}
      bone={[BoneID.EarR_0, BoneID.EarR_1, BoneID.EarR_1]}
    />
    <Behaviour value={require("../src/behaviours/eatYourFiles").default} />
  </App>
);
