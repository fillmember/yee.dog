import React from "react";
import { TweenMax } from "gsap";
import FileProcessor from "./FileProcessor.js";

export default class Audio {
  static MODE_SHORT = "MODE_SHORT";
  static MODE_LONG = "MODE_LONG";
  mode = null;
  constructor() {
    const audio = this;
    this.$mediaElement = React.createRef();
    this.reactComponent = class AudioComponent extends React.Component {
      static instance = null;
      state = {
        url: null
      };
      componentDidMount() {
        audio.reactComponent.instance = this;
      }
      componentDidUpdate(previousProps, previousState) {
        if (previousState.url !== this.state.url) {
          URL.revokeObjectURL(previousState.url);
        }
      }
      componentWillUnmount() {
        audio.reactComponent.instance = null;
      }
      render() {
        return (
          <div>
            <audio
              ref={audio.$mediaElement}
              src={this.state.url}
              id="dog-sound"
            />
          </div>
        );
      }
    };
  }
  //
  context = null;
  nodes = {};
  createAudioContext() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = this.context.createAnalyser();
    const gain = this.context.createGain();
    const destination = this.context.destination;
    [analyser, gain, destination].reduce((node, next) => {
      node.connect(next);
      return next;
    });
    this.nodes = {
      analyser,
      gain,
      destination
    };
  }
  reconnectNodes() {
    const { source, analyser, gain, destination } = this.nodes;
    this.nodes = { source, analyser, gain, destination };
  }
  fileReader = new FileReader();
  audioBuffer = null;
  decodeAudioFile(file) {
    this.fileReader.onload = () => {
      const buffer = this.fileReader.result;
      this.context.decodeAudioData(
        buffer,
        audioBuffer => {
          this.audioBuffer = audioBuffer;
          const durationInSec = audioBuffer.length / audioBuffer.sampleRate;
          this.mode = durationInSec > 1 ? Audio.MODE_LONG : Audio.MODE_SHORT;
        },
        error => console.warn("Dog Audio: failed to decode audio data. ", error)
      );
    };
    this.fileReader.readAsArrayBuffer(file);
  }
  onFileProcess = (file, type) => {
    if (type === FileProcessor.TYPE_AUDIO) {
      if (this.context === null) {
        this.createAudioContext();
      }
      this.decodeAudioFile(file);
    }
  };
  onFileStart = () => {};
  startBufferSourceNode(node, fadeDuration = 0) {
    return new Promise((resolve, reject) => {
      try {
        node.start();
        TweenMax.to(node.gain, fadeDuration, {
          value: 1,
          onComplete: resolve
        });
      } catch (e) {
        // reject(e);
      }
    });
  }
  stopBufferSourceNode(node, fadeDuration = 0.2) {
    return new Promise((resolve, reject) => {
      try {
        TweenMax.to(node.gain, fadeDuration, {
          value: 0,
          onComplete: () => {
            node.stop();
            resolve();
          }
        });
      } catch (e) {
        // reject(e);
      }
    });
  }
  createBufferSourceNode() {
    this.nodes.source = this.context.createBufferSource();
    this.nodes.source.buffer = this.audioBuffer;
    this.nodes.source.connect(this.nodes.analyser);
  }
  bark(bool) {
    if (this.context === null) {
      this.createAudioContext();
    }
    if (bool) {
      if (this.nodes.source) {
        this.stopBufferSourceNode(this.nodes.source, 0.1);
      }
      this.createBufferSourceNode();
      this.startBufferSourceNode(this.nodes.source, 0.03);
    } else {
      if (this.nodes.source) {
        this.stopBufferSourceNode(this.nodes.source, 0.03);
      }
    }
  }
}
