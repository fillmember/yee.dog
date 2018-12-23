import React from "react";
import DoggoBehaviour from "./DoggoBehaviour.js";
import Audio from "../Audio.js";

export default class BaseAudio extends DoggoBehaviour {
  constructor() {
    super();
    this.audio = new Audio();
  }
  renderUI() {
    const Audio = this.audio.reactComponent;
    return <Audio />;
  }
}
