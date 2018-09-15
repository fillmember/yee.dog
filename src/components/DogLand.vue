<template>
  <div class="hello">
    <canvas ref="canvas" @mousedown="onMousedown" @mouseup="onMouseup"></canvas>
    <div class="menu">
      <button class="debug-toggle" @click="debug = !debug">debug view: {{debug ? "yes" : "no"}}</button>
    </div>
  </div>
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
    this.stage3D.load({});
    this.stage3D.debug = this.$store.state.debug;
    this.bind();
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this._animationFrameID);
    this.unbind();
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
      this.renderLoop();
    },
    unbind() {
      window.removeEventListener("resize", this.onResize);
      cancelAnimationFrame(this._renderLoopID);
    },
    renderLoop(t) {
      this.stage3D.update();
      this.stage3D.render();
      this._renderLoopID = requestAnimationFrame(this.renderLoop);
    },
    onResize() {
      this.stage3D.resize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    },
    onMousedown(evt) {
      const action = this.stage3D.dog.animation.actions.bark;
      TweenMax.to(action, 0.07, {
        time: 1,
        ease: Power2.easeOut
      });
    },
    onMouseup(evt) {
      const action = this.stage3D.dog.animation.actions.bark;
      TweenMax.to(action, 0.07, {
        time: 0,
        ease: Power2.easeOut
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- Consider: https://github.com/c8r/vue-styled-system -->
<style scoped>
.hello {
  margin: 0;
  padding: 0;
}
.menu {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
}
</style>
