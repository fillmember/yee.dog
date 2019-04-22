import "./../src/css/reset.css";
import "./../src/css/basic.css";

import React from "react";
import App from "../src/App";

import DoggoBehaviour from "../src/behaviours/DoggoBehaviourReact";
import { DoggoBehaviourBaseIKInReact } from "../src/behaviours/baseIK";
import petTheDog from "../src/behaviours/petTheDog";
import ikTargetToMouse from "../src/behaviours/ikTargetToMouse";

import BoneID from "../src/3D/BoneID";

// prettier-ignore
export default () => (
  <App>
    <DoggoBehaviour value={require("../src/behaviours/resize").default} />
    <DoggoBehaviour value={require("../src/behaviours/orbitcontrol").default} />
    <DoggoBehaviour value={require("../src/behaviours/baseMouseTo3D").default} />
    <DoggoBehaviour value={require("../src/behaviours/bark").default} useMouse={true} />
    <DoggoBehaviour value={require("../src/behaviours/wag").default} />
    <DoggoBehaviour value={require("../src/behaviours/earWagL").default} />
    <DoggoBehaviour value={require("../src/behaviours/earWagR").default} />
    <DoggoBehaviour value={require("../src/behaviours/vleg").default} useMouse={true} />
    <DoggoBehaviour value={require("../src/behaviours/particleSystem").default} />
    <DoggoBehaviourBaseIKInReact />
    <DoggoBehaviour value={ikTargetToMouse} chain={"worm"} />
    <DoggoBehaviour value={ikTargetToMouse} chain={"look"} />
    <DoggoBehaviour value={petTheDog} action={"earWagL"} bone={[BoneID.EarL_0, BoneID.EarL_1, BoneID.EarL_1]} />
    <DoggoBehaviour value={petTheDog} action={"earWagR"} bone={[BoneID.EarR_0, BoneID.EarR_1, BoneID.EarR_1]} />
    <DoggoBehaviour value={require("../src/behaviours/eatYourFiles").default} />
  </App>
);
