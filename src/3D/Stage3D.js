import throttle from "lodash/throttle";
import {
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  Clock,
  AxesHelper,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  BackSide,
  Raycaster,
  Vector3,
  Vector2
} from "three";
import GLTFLoader from "three-gltf-loader";
import MakeOrbitControls from "three-orbit-controls";
import Dog from "./Dog3D.js";

import {
  MOUSE,
  Quaternion,
  Spherical,
  // PerspectiveCamera,
  EventDispatcher
} from "three";

const OrbitControls = MakeOrbitControls({
  MOUSE,
  Quaternion,
  Spherical,
  Vector3,
  Vector2,
  PerspectiveCamera,
  EventDispatcher
});

export default class Stage3D {
  renderer = new WebGLRenderer();
  raycaster = new Raycaster();
  //
  mouse3D = new Vector3(0, 0, -100);
  mouse2D = new Vector2();
  mousePlane = new Mesh(
    new PlaneGeometry(20, 20, 1, 1),
    new MeshBasicMaterial({
      colorWrite: false,
      depthWrite: false,
      depthTest: false
    })
  );
  constructor({ width, height }) {
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x1b8547);
    this.camera = new PerspectiveCamera(22, width / height, 0.01, 10000);
    this.camera.position.set(-20, 2, -20);
    this.renderer.setSize(width, height);
    //
    this.orbitcontrols = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
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
          this.scene = gltf.scene;
          this.scene.add(this.camera);
          //
          this.dog = new Dog({
            obj3d: this.scene.getObjectByName("Mesh"),
            scene: this.scene
          });
          //
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          this.scene.add(light);
          //
          this.camera.add(this.mousePlane);
          this.mousePlane.position.set(0, 0, -25);
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
  start({ updateUI }) {
    const clock = new Clock(true);
    this.renderer.setAnimationLoop(() => {
      const dt = clock.getDelta();
      this.update(dt);
      this.render();
      // updateUI && updateUI({type:'frame', value:{dt,elapsed}})
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
    this.raycast();
    if (this.dog) {
      this.dog.update(dt);
    }
    this.orbitcontrols.update(dt);
  }
  raycast = throttle(() => {
    this.raycaster.setFromCamera(this.mouse2D, this.camera);
    var intersect = [];
    this.raycaster.intersectObject(this.mousePlane, false, intersect);
    intersect.forEach(({ point }) => {
      this.mouse3D.copy(point);
    });
    //
    this.dog.lookAt(this.mouse3D);
  }, 17);
  render() {
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  updatePointer({ x, y }) {
    this.mouse2D.set(x, y);
  }
}
