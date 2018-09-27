import React from "react";
import { TweenMax } from "gsap";
import FileProcessor from "./FileProcessor.js";

export default class Audio {
  constructor() {
    const audio = this;
    this.reactComponent = class AudioComponent extends React.Component {
      static instance = null;
      constructor() {
        super();
        audio.reactComponent.instance = this;
      }
      render() {
        return <div />;
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
          const durationInSeconds = audioBuffer.length / audioBuffer.sampleRate;
        },
        error => console.warn("Dog Audio: failed to decode audio data. ", error)
      );
    };
    this.fileReader.readAsArrayBuffer(file);
  }
  //
  // Dog Behaviours
  //
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
      node.start();
      TweenMax.to(node.gain, fadeDuration, {
        value: 1,
        onComplete: resolve
      });
    });
  }
  stopBufferSourceNode(node, fadeDuration = 0.2) {
    return new Promise((resolve, reject) => {
      TweenMax.to(node.gain, fadeDuration, {
        value: 0,
        onComplete: () => {
          try {
            node.stop();
          } catch (e) {
            // dispose error
          }
          resolve();
        }
      });
    });
  }
  bark(bool) {
    if (this.context === null) {
      this.createAudioContext();
    }
    if (bool) {
      if (this.nodes.source) {
        this.stopBufferSourceNode(this.nodes.source, 0.1);
      }
      this.nodes.source = this.context.createBufferSource();
      this.nodes.source.buffer = this.audioBuffer;
      this.nodes.source.connect(this.nodes.analyser);
      this.startBufferSourceNode(this.nodes.source);
    } else {
      if (this.nodes.source) {
        this.stopBufferSourceNode(this.nodes.source);
      }
    }
  }
}
