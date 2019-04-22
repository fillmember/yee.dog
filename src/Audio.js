import React from "react";
import { TweenMax } from "gsap";

export default class Audio {
  static MODE_SHORT = "MODE_SHORT";
  static MODE_LONG = "MODE_LONG";
  mode = null;
  constructor() {
    const audio = this;
    this.$mediaElement = React.createRef();
    this.reactComponent = class AudioComponent extends React.Component {
      static instance = null;
      constructor(props) {
        super(props);
        audio.reactComponent.instance = this;
        this.state = {
          isAudioAllow: false,
          isAudioReady: false,
          url: "/static/sound/dog.wav"
        };
      }
      actionAllowAudio = () => {
        const { url } = this.state;
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
          audio.createAudioContext();
          audio.context.decodeAudioData(
            request.response,
            buffer => {
              audio.audioBuffer = buffer;
              this.setState({ isAudioReady: true });
            },
            console.error
          );
        };
        request.send();
        this.setState({ isAudioAllow: true });
      };
      componentDidUpdate(prevProps, previousState) {
        if (previousState.url !== this.state.url) {
          URL.revokeObjectURL(previousState.url);
        }
      }
      componentWillUnmount() {
        audio.reactComponent.instance = null;
      }
      render() {
        const { isAudioAllow, isAudioReady } = this.state;
        if (!isAudioAllow) {
          return (
            <button onClick={this.actionAllowAudio}>
              Allow This Dog to Audibly Bark
            </button>
          );
        }
        if (!isAudioReady) {
          return <span>Telling doggo the good news...</span>;
        }
        return false;
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
    return new Promise((resolve, reject) => {
      this.fileReader.onload = () => {
        const buffer = this.fileReader.result;
        this.context.decodeAudioData(
          buffer,
          audioBuffer => {
            this.audioBuffer = audioBuffer;
            const durationInSec = audioBuffer.length / audioBuffer.sampleRate;
            this.mode = durationInSec > 1 ? Audio.MODE_LONG : Audio.MODE_SHORT;
          },
          error =>
            console.warn("Dog Audio: failed to decode audio data. ", error)
        );
        resolve(true);
      };
      this.fileReader.onerror = reject;
      this.fileReader.readAsArrayBuffer(file);
    });
  }
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
            try {
              node.stop();
            } catch (e) {}
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
  // public methods
  use(file, mode = Audio.MODE_SHORT) {
    if (this.context === null) {
      this.createAudioContext();
    }
    this.decodeAudioFile(file);
    this.mode = mode;
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
