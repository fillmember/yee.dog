import React, { Component } from "react";

class App extends Component {
  render() {
    return <div className="App">1</div>;
  }
}

export default App;
export const oldVueComponent = {
  mounted() {
    this.stage3D = new Stage3D({ domElement: this.$refs.canvas });
    this.stage3D.init({ width: window.innerWidth, height: window.innerHeight });
    this.stage3D.load();
    this.stage3D.debug = this.$store.state.debug;
    this.stage3D.start();
    this.bind();
    //
    this.$store.commit("commitStage", this.stage3D);
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this._animationFrameID);
    this.unbind();
    this.stage3D.stop();
    this.stage3D.destroy();
  },
  computed: {
    debug: {
      get() {
        return this.$store.state.debug;
      },
      set(v) {
        this.$store.commit("TOGGLE_DEBUG", v);
      }
    }
  },
  watch: {
    debug() {
      this.stage3D.debug = this.$store.state.debug;
    }
  },
  methods: {
    bind() {
      window.addEventListener("resize", this.onResize);
      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
    },
    unbind() {
      window.removeEventListener("resize", this.onResize);
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);
    },
    onResize() {
      this.stage3D.resize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    },
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
    },
    onKeyDown(evt) {
      switch (evt.keyCode) {
        case 32:
          this.stage3D.dog && this.stage3D.dog.bark(true);
          break;
      }
    },
    onKeyUp(evt) {
      switch (evt.keyCode) {
        case 32:
          this.stage3D.dog && this.stage3D.dog.bark(false);
          break;
      }
    }
  }
};
