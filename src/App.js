import React, { Component } from "react";
import { Provider as ThemeProvider } from "rebass";
import DropZone from "react-dropzone";
import throttle from "lodash/throttle";
import FileProcessor from "./FileProcessor.js";
import Stage3D from "./3D/Stage3D.js";
import { DogProvider } from "./DogContext.js";
import Audio from "./Audio.js";
import AppEventHandlers from "./AppEventHandlers.js";
import theme from "./theme.js";

const nostyle = {};
class App extends Component {
  $canvasContainer = React.createRef();
  //
  files = new FileProcessor();
  audio = new Audio();
  state = {
    stage3D: new Stage3D({
      width: window.innerWidth,
      height: window.innerHeight,
      updateUI: this.updateProvider
    }),
    providerValue: {
      audio: this.audio.current,
      stage: false,
      dog: false,
      event: false,
      update: this.updateProvider
    }
  };
  //
  updateProvider = throttle(event => {
    this.setState({
      providerValue: {
        audio: this.audio.current,
        stage: this.state.stage3D,
        dog: this.state.stage3D.dog,
        update: this.updateProvider,
        event
      }
    });
    window.dog = this.state.stage3D;
  }, 1 / 30);
  componentDidMount() {
    //
    AppEventHandlers.apply(this);
    //
    this.state.stage3D.load("/static/model/wt.glb").then(() => {
      this.$canvasContainer.current.appendChild(
        this.state.stage3D.renderer.domElement
      );
      this.state.stage3D.start();
      this.bind();
      this.updateProvider({ type: "loaded" });
    });
  }
  componentWillUnmount() {
    this.unbind();
  }
  render() {
    const Audio = this.audio.reactComponent;
    return (
      <ThemeProvider theme={theme}>
        <DogProvider value={this.state.providerValue}>
          <DropZone
            onDragEnter={this.onDragEnter}
            onDragOver={this.onDragOver}
            onDragStart={this.onDragStart}
            onDrop={this.onDrop}
            onDragLeave={this.onDragLeave}
            getDataTransferItems={this.getDataTransferItems}
            disableClick
            disablePreview
            activeStyle={nostyle}
            acceptStyle={nostyle}
            disabledStyle={nostyle}
            multiple={false}
          >
            <div className="App">
              <div
                className="3d-container"
                ref={this.$canvasContainer}
                style={{ fontSize: 0, lineHeight: 0 }}
              />
              <Audio />
              {this.props.children}
            </div>
          </DropZone>
        </DogProvider>
      </ThemeProvider>
    );
  }
}

export default App;
