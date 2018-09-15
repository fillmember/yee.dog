<template>
  <div class="hello">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import Stage3D from "./Stage3D.js";

export default {
  name: "DogLand",
  created() {
    // non-reactive data here
  },
  mounted() {
    this.stage3D = new Stage3D({ domElement: this.$refs.canvas });
    this.stage3D.init({ width: window.innerWidth, height: window.innerHeight });
    this.stage3D.load({});
    this.bind();
  },
  beforeDestroy() {
    window.cancelAnimationFrame(this._animationFrameID);
    this.unbind();
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
