import React from "react";
import DoggoBehaviour from "./DoggoBehaviour";
import Audio from "../Audio";
import Bark from "./bark";

export default class BaseAudio extends DoggoBehaviour {
  constructor() {
    super();
    this.audio = new Audio();
    this.on(Bark.EVENT_BARK_START, this.startBark);
    this.on(Bark.EVENT_BARK_END, this.stopBark);
  }
  startBark = () => {
    const { isAudioReady } = this.audio.reactComponent.instance.state;
    if (isAudioReady) {
      this.audio.bark(true);
    }
  };
  stopBark = () => {
    const { isAudioReady } = this.audio.reactComponent.instance.state;
    if (isAudioReady) {
      this.audio.bark(false);
    }
  };
  renderUI() {
    const Audio = this.audio.reactComponent;
    return <Audio />;
  }
}
