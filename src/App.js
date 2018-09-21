import React, { Component } from "react";
import { ThemeProvider } from "styled-components";
import Stage3D from "./3D/Stage3D.js";
import { DogProvider } from "./DogContext.js";
import Debug from "./UI/Debug.js";
import theme from "./theme.js";
import throttle from "lodash/throttle";
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
      event: false,
      update: this.updateProvider
    }
  };
  //
  updateProvider = throttle(event => {
    this.setState({
      providerValue: {
        stage: this.state.stage3D,
        dog: this.state.stage3D.dog,
        update: this.updateProvider,
        event
      }
    });
    window.dog = this.state.stage3D;
  }, 1 / 30);
  onDragStart = evt => {
    console.log(evt);
    evt.nativeEvent.stopPropagation && evt.nativeEvent.stopPropagation();
    console.log("onDragStart", evt);
    evt.preventDefault();
  };
  onDragEnter = evt => {
    evt.nativeEvent.stopPropagation && evt.nativeEvent.stopPropagation();
    console.log("onDragEnter", evt);
    evt.preventDefault();
  };
  onDragLeave = evt => {
    evt.nativeEvent.stopPropagation && evt.nativeEvent.stopPropagation();
    console.log("onDragLeave", evt);
    evt.preventDefault();
  };
  onDragEnd = evt => {
    evt.nativeEvent.stopPropagation && evt.nativeEvent.stopPropagation();
    console.log("onDragEnd", evt);
    evt.preventDefault();
  };
  onDrop = evt => {
    console.log(evt);
    evt.nativeEvent.stopPropagation && evt.nativeEvent.stopPropagation();
    console.log("onDrop", evt);
    evt.preventDefault();
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
  onResize = () => {
    this.state.stage3D.resize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  onMouseMove = evt => {
    const renderer = this.state.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (evt.offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(evt.offsetY / canvas.offsetHeight) * 2 + 1;
      this.state.stage3D.updatePointer({ x, y });
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
        this.updateProvider({ type: "read" });
      });
    //
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.state.stage3D.renderer.domElement.addEventListener(
      "mousemove",
      this.onMouseMove
    );
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    this.state.stage3D.renderer.domElement.removeEventListener(
      "mousemove",
      this.onMouseMove
    );
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <DogProvider value={this.state.providerValue}>
          <div className="App">
            <div className="3d-container" ref={this.$canvasContainer} />
            <Debug />
          </div>
        </DogProvider>
      </ThemeProvider>
    );
  }
}

export default App;
