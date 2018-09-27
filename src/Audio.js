import React from "react";
import { TweenMax } from "gsap";
import FileProcessor from "./FileProcessor.js";
import dog_wav from "./sound/dog.wav";

export default class Audio {
  context = null;
  $mediaElement = React.createRef();
  constructor() {
    const audio = this;
    //
    this.reactComponent = class AudioComponent extends React.Component {
      static instance = null;
      constructor() {
        super();
        audio.reactComponent.instance = this;
      }
      state = {
        url: dog_wav
      };
      componentDidUpdate(previousProps, previousState) {
        if (previousState.url !== this.state.url) {
          URL.revokeObjectURL(previousState.url);
        }
      }
      componentDidMount() {
        audio.domElementReady = true;
      }
      render() {
        return (
          <audio
            ref={audio.$mediaElement}
            src={this.state.url}
            id="dog-sound"
          />
        );
      }
    };
  }
  //
  createAudioContext() {
    if (!this.$mediaElement.current) {
      console.warn("audio DOM element is not ready yet.");
      return;
    }
    this.context = new AudioContext();
    const source = this.context.createMediaElementSource(
      this.$mediaElement.current
    );
    const analyser = this.context.createAnalyser();
    const gain = this.context.createGain();
    const destination = this.context.destination;
    // Node Chain
    [source, analyser, gain, destination].reduce((node, next) => {
      node.connect(next);
      return next;
    });
    // Node references
    this.nodes = {
      source,
      analyser,
      gain,
      destination
    };
  }
  //
  // Dog Behaviours
  //
  onFileProcess = () => {};
  onFileStart = (file, type, processor) => {
    if (type === FileProcessor.TYPE_AUDIO) {
      this.reactComponent.instance.setState({
        url: URL.createObjectURL(file)
      });
    }
  };
  bark(bool) {
    if (this.$mediaElement.current) {
      if (this.context === null) {
        this.createAudioContext();
      }
      if (bool) {
        TweenMax.to(this.nodes.gain.gain, 0, {
          value: 1
        });
        this.$mediaElement.current.currentTime = 0;
        this.$mediaElement.current.play();
      } else {
        TweenMax.to(this.nodes.gain.gain, 0.2, {
          value: 0
        });
      }
    }
  }
}
