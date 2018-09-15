import {
  MeshLambertMaterial,
  PerspectiveCamera,
  WebGLRenderer,
  DirectionalLight,
  LinearEncoding
} from "three";
import GLTFLoader from "three-gltf-loader";
import MakeOrbitControls from "three-orbit-controls";
import { TweenMax } from "gsap";
import { IKSolver } from "three-ik";

const THREE = require("three");
const OrbitControls = MakeOrbitControls(THREE);

export default class Stage3D {
  constructor({ domElement } = {}) {
    this.domElement = domElement;
  }
  init({ width, height }) {
    const camera = (this.camera = new PerspectiveCamera(
      22,
      width / height,
      0.1,
      1000
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
    this.orbitcontrols.enablePan = false;
    this.orbitcontrols.enableZoom = false;
    //
  }
  load({ progressCallback } = {}) {
    var loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(
        `${process.env.BASE_URL}model/wt.glb`,
        gltf => {
          const scene = (this.scene = gltf.scene);
          const dog = (this.dog = scene.getObjectByName("Mesh"));
          //
          dog.material.map.encoding = LinearEncoding;
          var mat = new MeshLambertMaterial({
            color: 0x444444,
            map: dog.material.map,
            skinning: true,
            emissive: 0xffffff,
            emissiveMap: dog.material.map
          });
          dog.material = mat;
          //
          var light = new DirectionalLight(0xffffff, 1);
          light.position.set(0, 1, 0.5);
          scene.add(light);
          //
          dog.position.y = -0.4;

          //
          resolve();
        },
        function(xhr) {
          if (progressCallback) {
            progressCallback(xhr.loaded / xhr.total);
          }
        },
        function(error) {
          reject(error);
        }
      );
    });
  }
  resize({ width = window.innerWidth, height = window.innerHeight } = {}) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  update(dt) {
    this.orbitcontrols.update();
  }
  render() {
    if (this.scene) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}
