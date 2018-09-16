import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  GridHelper,
  Clock
} from "three";
import GLTFLoader from "three-gltf-loader";
import MakeOrbitControls from "three-orbit-controls";
import { TweenMax } from "gsap";
import { IKSolver } from "three-ik";

const THREE = require("three");
const OrbitControls = MakeOrbitControls(THREE);

import Dog from "./Dog3D.js";

export default class Stage3D {
  constructor({ domElement } = {}) {
    this.domElement = domElement;
  }
  init({ width, height }) {
    const camera = (this.camera = new PerspectiveCamera(
      22,
      width / height,
      0.01,
      10000
    ));
    this.camera.position.set(-20, 2, -20);
    //
    const renderer = (this.renderer = new WebGLRenderer({
      canvas: this.domElement
    }));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x1b8547);
    this.renderer.setSize(width, height);
    //
    this.orbitcontrols = new OrbitControls(camera, this.domElement);
    this.orbitcontrols.autoRotate = true;
    this.orbitcontrols.autoRotateSpeed = 0.033;
    this.orbitcontrols.enableDamping = true;
    this.orbitcontrols.rotateSpeed = 0.3;
    this.orbitcontrols.dampingFactor = 0.1;
    this.orbitcontrols.enablePan = true;
    this.orbitcontrols.enableZoom = true;
  }
  load() {
    var loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        `${process.env.BASE_URL}model/wt.glb`,
        gltf => {
          const scene = (this.scene = gltf.scene);
          const dog = (this.dog = new Dog({
            obj3d: scene.getObjectByName("Mesh"),
            scene
          }));
          //
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          scene.add(light);
          //
          resolve();
        },
        function(xhr) {},
        function(error) {
          reject(error);
        }
      );
    });
  }
  start() {
    const clock = new Clock(true);
    this.renderer.setAnimationLoop(time => {
      this.update(clock.getDelta(), clock.getElapsedTime());
      this.render();
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
  update(dt, time) {
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
  destroy() {
    this.renderer.dispose();
    this.renderer = null;
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
