<template>
  <div class="hello">
    <canvas ref="canvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import {
  MeshLambertMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight
} from "three";
import GLTFLoader from "three-gltf-loader";
import { TweenMax } from "gsap";
import { IKSolver } from "three-ik";

export default {
  name: "DogLand",
  data() {
    return {
      ready: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  created() {
    // non-reactive data here
  },
  mounted() {
    this.load();
    this.onResize();
    window.addEventListener("resize", this.onResize);
    this.update();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  methods: {
    load() {
      var loader = new GLTFLoader();
      loader.load(
        `${process.env.BASE_URL}model/wt.glb`,
        gltf => {
          const camera = (this.camera = new PerspectiveCamera(
            22,
            this.ratio,
            0.1,
            1000
          ));
          const renderer = (this.renderer = new WebGLRenderer({
            canvas: this.$refs.canvas
          }));
          renderer.setPixelRatio(window.devicePixelRatio);
          renderer.setClearColor(0x1b8547);
          const scene = (this.scene = gltf.scene);
          const dog = (this.dog = scene.getObjectByName("Mesh"));
          // Correct material
          var mat = new MeshLambertMaterial({
            color: 0x444444,
            map: dog.material.map,
            skinning: true,
            emissive: 0xffffff,
            emissiveMap: dog.material.map
          });
          dog.material = mat;
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          scene.add(light);
          camera.position.set(-20, 2, -20);
          this.ready = true;
        },
        function(xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function(error) {
          console.log("An error happened", error);
        }
      );
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      if (this.ready) {
        const w = this.width;
        const h = this.height;
        const r = this.ratio;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    },
    update() {
      if (this.ready) {
        this.renderer.render(this.scene, this.camera);
      }
      window.requestAnimationFrame(this.update);
    }
  },
  computed: {
    ratio() {
      return this.width / this.height;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
