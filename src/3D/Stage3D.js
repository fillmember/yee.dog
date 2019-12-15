import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  Clock,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  Raycaster,
  Vector3,
  Vector2
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import Dog from "./Dog3D";

export default class Stage3D {
  renderer = new WebGLRenderer();
  raycaster = new Raycaster();
  //
  mouse3D = new Vector3(0, 0, -100);
  mouse2D = new Vector2(-999, -999);
  mousePlane = new Mesh(
    new PlaneGeometry(20, 20, 1, 1),
    new MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      depthTest: false
    })
  );
  constructor({ width, height, onRender, onUpdate }) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x1b8547);
    this.camera = new PerspectiveCamera(22, width / height, 0.01, 10000);
    this.camera.position.set(-20, 2, -20);
    this.renderer.setSize(width, height);
    this.onRender = onRender || function() {};
    this.onUpdate = onUpdate || function() {};
  }
  load(url) {
    var loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        gltf => {
          this.scene = gltf.scene;
          this.scene.add(this.camera);
          this.dog = new Dog({
            obj3d: this.scene.getObjectByName("Wurstgang"),
            scene: this.scene
          });
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          this.scene.add(light);
          this.camera.add(this.mousePlane);
          this.mousePlane.position.set(0, 0, -25);
          resolve();
        },
        function() {},
        function(error) {
          reject(error);
        }
      );
    });
  }
  toScreenPosition(obj, target = new Vector3()) {
    // We already update matrix world else where, leave this commented.
    // Don't remove
    //
    // obj.updateMatrixWorld();
    //
    target.setFromMatrixPosition(obj.matrixWorld);
    target.project(this.camera);
    return target;
  }
  start() {
    const clock = new Clock(true);
    this.renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      this.onUpdate(dt);
      this.update(dt);
      //
      this.onRender();
      this.render();
    });
  }
  stop() {
    this.renderer.setAnimationLoop(null);
  }
  resize = throttle(
    ({ width = window.innerWidth, height = window.innerHeight } = {}) => {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    },
    1 / 30
  );
  update(dt) {
    if (this.dog) {
      this.dog.update(dt);
    }
  }
  render() {
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  updatePointer({ x, y }) {
    this.mouse2D.set(x, y);
  }
}
