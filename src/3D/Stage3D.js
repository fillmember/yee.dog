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
import GLTFLoader from "three-gltf-loader";
import MakeOrbitControls from "three-orbit-controls";
import BoneID from "./BoneID.js";
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
  mouse2D = new Vector2(-999, -999);
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
      this.update(dt);
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
      this.raycast();
      this.dog.update(dt);
      this.pet();
    }
    this.orbitcontrols && this.orbitcontrols.update(dt);
  }
  raycast = throttle(() => {
    this.raycaster.setFromCamera(this.mouse2D, this.camera);
    let intersect = [];
    this.raycaster.intersectObject(this.mousePlane, false, intersect);
    intersect.forEach(({ point }) => {
      this.mouse3D.copy(point);
    });
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
  _mouseIsAround_screenPosition = new Vector2();
  _mouseIsAround(...boneIDs) {
    this._mouseIsAround_screenPosition.set(0, 0);
    boneIDs.forEach(boneID => {
      const bone = this.dog.dog.skeleton.bones[boneID];
      this._mouseIsAround_screenPosition.add(this.toScreenPosition(bone));
    });
    this._mouseIsAround_screenPosition.multiplyScalar(1 / boneIDs.length);
    const distanceSquared = this.mouse2D.distanceToSquared(
      this._mouseIsAround_screenPosition
    );
    return distanceSquared < 0.0016;
  }
  pet = throttle(() => {
    const isPettingEarL = this._mouseIsAround(BoneID.EarL_0, BoneID.EarL_1);
    TweenMax.to(this.dog.animation.actions.earWagL, 0.5, {
      weight: isPettingEarL ? 0.6 : 0
    });
    const isPettingEarR = this._mouseIsAround(BoneID.EarR_0, BoneID.EarR_1);
    TweenMax.to(this.dog.animation.actions.earWagR, 0.5, {
      weight: isPettingEarR ? 0.6 : 0
    });
  }, 200);
}
