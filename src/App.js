import React, { Component } from "react";
import Stage3D from "./3D/Stage3D.js";

class App extends Component {
  $canvasContainer = React.createRef();
  onResize = () => {
    this.stage3D.resize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  onKeyDown = evt => {
    switch (evt.keyCode) {
      case 32:
        this.stage3D.dog && this.stage3D.dog.bark(true);
        break;
      default:
        break;
    }
  };
  onKeyUp = evt => {
    switch (evt.keyCode) {
      case 32:
        this.stage3D.dog && this.stage3D.dog.bark(false);
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    this.stage3D = new Stage3D();
    this.stage3D.init({
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.stage3D.load(process.env.PUBLIC_URL + "/model/wt.glb").then(() => {
      this.stage3D.start();
      this.$canvasContainer.current.appendChild(
        this.stage3D.renderer.domElement
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
      <div className="App">
        <div className="3d-container" ref={this.$canvasContainer} />
      </div>
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
