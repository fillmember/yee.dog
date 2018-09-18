import React, { Component } from "react";
import Stage3D from "./3D/Stage3D.js";
import { DogProvider } from "./DogContext.js";
import Debug from "./UI/Debug.js";

class App extends Component {
  $canvasContainer = React.createRef();
  state = {
    stage3D: new Stage3D({
      width: window.innerWidth,
      height: window.innerHeight,
      updateUI: this.updateProvider
    }),
    providerValue: {
      stage: false,
      dog: false,
      update: this.updateProvider
    }
  };
  //
  updateProvider = ({ type, value } = {}) => {
    this.setState({
      providerValue: {
        stage: this.state.stage3D,
        dog: this.state.stage3D.dog,
        update: this.updateProvider
      }
    });
  };
  onResize = () => {
    this.state.stage3D.resize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  onKeyDown = evt => {
    switch (evt.keyCode) {
      case 32:
        this.state.stage3D.dog && this.state.stage3D.dog.bark(true);
        break;
      default:
        break;
    }
  };
  onKeyUp = evt => {
    switch (evt.keyCode) {
      case 32:
        this.state.stage3D.dog && this.state.stage3D.dog.bark(false);
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    this.state.stage3D
      .load(process.env.PUBLIC_URL + "/model/wt.glb")
      .then(() => {
        this.$canvasContainer.current.appendChild(
          this.state.stage3D.renderer.domElement
        );
        this.state.stage3D.start({ updateUI: this.updateProvider });
        // this.updateProvider()
      });
    //
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }
  render() {
    return (
      <DogProvider value={this.state.providerValue}>
        <div className="App">
          <div className="3d-container" ref={this.$canvasContainer} />
          <Debug />
        </div>
      </DogProvider>
    );
  }
}

export default App;
