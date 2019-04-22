import React from "react";

import App from "../App";
import DoggoBehaviour from "../behaviours/DoggoBehaviourReact";
import { DoggoBehaviourBaseIKInReact } from "../behaviours/baseIK";
import petTheDog from "../behaviours/petTheDog";
import ikTargetToMouse from "../behaviours/ikTargetToMouse";
import BoneID from "../3D/BoneID";

// prettier-ignore
export default () => (
  <App>
    <DoggoBehaviour value={require("../behaviours/resize").default} />
    <DoggoBehaviour value={require("../behaviours/orbitcontrol").default} />
    <DoggoBehaviour value={require("../behaviours/baseMouseTo3D").default} />
    <DoggoBehaviour value={require("../behaviours/bark").default} useMouse={true} />
    <DoggoBehaviour value={require("../behaviours/wag").default} />
    <DoggoBehaviour value={require("../behaviours/earWagL").default} />
    <DoggoBehaviour value={require("../behaviours/earWagR").default} />
    <DoggoBehaviour value={require("../behaviours/vleg").default} useMouse={true} />
    <DoggoBehaviour value={require("../behaviours/particleSystem").default} />
    <DoggoBehaviourBaseIKInReact />
    <DoggoBehaviour value={ikTargetToMouse} chain={"worm"} />
    <DoggoBehaviour value={ikTargetToMouse} chain={"look"} />
    <DoggoBehaviour value={petTheDog} action={"earWagL"} bone={[BoneID.EarL_0, BoneID.EarL_1, BoneID.EarL_1]} />
    <DoggoBehaviour value={petTheDog} action={"earWagR"} bone={[BoneID.EarR_0, BoneID.EarR_1, BoneID.EarR_1]} />
    <DoggoBehaviour value={require("../behaviours/eatYourFiles").default} />
    <DoggoBehaviour value={require("../behaviours/baseAudio").default} />
  </App>
);
