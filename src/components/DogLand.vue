<template>
  <canvas
    ref="canvas"
    @mousedown="onMousedown"
    @mousemove="onMousemove"
    @mouseup="onMouseup"
  />
</template>

<script>
import Stage3D from "./Stage3D.js";
import { DOG_BARK_START, DOG_BARK_END } from "./Events.js";

export const MODE_BARK = "MODE_BARK";
export const MODE_DANCE = "MODE_DANCE";
export default {
  name: "DogLand",
  data() {
    return {
      mode: MODE_BARK
    };
  },
  created() {
    // non-reactive data here
  },
  mounted() {
    this.stage3D = new Stage3D({ domElement: this.$refs.canvas });
    this.stage3D.init({ width: window.innerWidth, height: window.innerHeight });
    this.stage3D.load();
    this.stage3D.debug = this.$store.state.debug;
    this.stage3D.start();
    this.bind();
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
        this.$store.commit("TOGGLE_DEBUG");
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
    },
    onMousedown(evt) {
      this.stage3D.dog && this.stage3D.dog.bark(true);
    },
    onMouseup(evt) {
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
</script>
