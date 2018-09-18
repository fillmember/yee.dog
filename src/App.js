import React, { Component } from "react";
import Stage3D from "./3D/Stage3D.js";
import { DogProvider } from "./DogContext.js";
import Debug from "./UI/Debug.js";

class App extends Component {
  $canvasContainer = React.createRef();
  state = {
    stage3D: new Stage3D({
      width: window.innerWidth,
      height: window.innerHeight
    })
  };
  //
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
        this.state.stage3D.start();
        this.$canvasContainer.current.appendChild(
          this.state.stage3D.renderer.domElement
        );
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
      <DogProvider value={this.state.stage3D}>
        <div className="App">
          <div className="3d-container" ref={this.$canvasContainer} />
          <Debug />
        </div>
      </DogProvider>
    );
  }
}

export default App;

export const oldVueComponent = {
  methods: {
    onMousemove(evt) {
      const x = 2 * (evt.offsetX / this.$refs.canvas.offsetWidth) - 1;
      const y = 1 - (evt.offsetY / this.$refs.canvas.offsetHeight) * 2;
      return { x, y };
    },
    onMousedown() {
      this.stage3D.dog && this.stage3D.dog.bark(true);
    },
    onMouseup() {
      this.stage3D.dog && this.stage3D.dog.bark(false);
    }
  }
};
