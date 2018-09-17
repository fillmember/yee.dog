<template>
  <div id="debug-ui">
    <div class="grid">
      <div>
        <h2>stage</h2>
        <div v-if="!!camera">
          camera pos: <br/>
          {{camera.position.x.toFixed(2)}} <br/>
          {{camera.position.y.toFixed(2)}} <br/>
          {{camera.position.z.toFixed(2)}}
        </div>
      </div>
      <div>
        <h2>dog</h2>
      </div>
      <div>
        <h2>ik</h2>
      </div>
      <div>
        <h2>animation</h2>
        <div v-if="!!animation">
          <button v-for="a in animation.mesh.animations">
            {{a}} : {{}}
          </button>
        </div>
      </div>
      <div>
        <button @click="$store.commit('TOGGLE_DEBUG', !$store.state.general.debug)">debug</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "debug",
  computed: {
    stage3d() {
      return this.$store.state.dog.stage;
    },
    camera() {
      return this.stage3d && this.stage3d.camera;
    },
    dog() {
      return this.stage3d && this.stage3d.dog;
    },
    animation() {
      return this.dog && this.dog.animation;
    },
    particles() {
      return this.dog && this.dog.particles;
    },
    ik() {
      return this.dog && this.dog.ik;
    }
  },
  mounted() {
    this.startUpdate();
  },
  methods: {
    startUpdate() {
      this.$forceUpdate();
      requestAnimationFrame(this.startUpdate);
    }
  }
};
</script>

<style scoped>
#debug-ui {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 20vh;
  min-height: 200px;
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;

  color: #fff;
  font-family: system-ui, sans-serif;

  font-size: 14px;
}
.grid {
  display: grid;
  grid-template-columns: 20fr 20fr 20fr 20fr 20fr;
}
h2 {
  margin: 0;
  padding: 0;
}
</style>
