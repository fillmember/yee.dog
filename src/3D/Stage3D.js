import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  Clock
} from "three";
import GLTFLoader from "three-gltf-loader";
import MakeOrbitControls from "three-orbit-controls";
import Dog from "./Dog3D.js";

import {
  MOUSE,
  Quaternion,
  Spherical,
  Vector2,
  Vector3,
  // PerspectiveCamera,
  EventDispatcher
} from "three";

const OrbitControls = MakeOrbitControls({
  MOUSE,
  Quaternion,
  Spherical,
  Vector2,
  Vector3,
  PerspectiveCamera,
  EventDispatcher
});

export default class Stage3D {
  constructor({ width, height }) {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x1b8547);
    const camera = (this.camera = new PerspectiveCamera(
      22,
      width / height,
      0.01,
      10000
    ));
    this.camera.position.set(-20, 2, -20);
    this.renderer.setSize(width, height);
    //
    this.orbitcontrols = new OrbitControls(camera, this.renderer.domElement);
    this.orbitcontrols.autoRotate = true;
    this.orbitcontrols.autoRotateSpeed = 0.033;
    this.orbitcontrols.enableDamping = true;
    this.orbitcontrols.rotateSpeed = 0.3;
    this.orbitcontrols.dampingFactor = 0.1;
    this.orbitcontrols.enablePan = false;
    this.orbitcontrols.enableZoom = false;
  }
  load(url) {
    var loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        gltf => {
          const scene = (this.scene = gltf.scene);
          this.dog = new Dog({
            obj3d: scene.getObjectByName("Mesh"),
            scene
          });
          //
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          scene.add(light);
          //
          resolve();
        },
        function() {},
        function(error) {
          reject(error);
        }
      );
    });
  }
  start({updateUI}) {
    const clock = new Clock(true);
    this.renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      this.update(dt);
      this.render();
      updateUI && updateUI({type:'frame', value:{dt,elapsed}})
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }
  resize({ width = window.innerWidth, height = window.innerHeight } = {}) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  update(dt) {
    if (this.dog) {
      this.dog.update(dt);
    }
    this.orbitcontrols.update(dt);
  }
  render() {
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  set debug(v) {
    if (this.dog) this.dog.debug = v;
    if (this.orbitcontrols) {
      this.orbitcontrols.autoRotate = !v;
      this.orbitcontrols.dampingFactor = 0.1;
      this.orbitcontrols.enablePan = v;
      this.orbitcontrols.enableZoom = v;
    }
  }
}
