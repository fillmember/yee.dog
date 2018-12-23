import { TweenMax } from "gsap";
import throttle from "lodash/throttle";
import debounce from "lodash/debounce";
import { ParticleTextureMap01 } from "./3D/ParticleTextureMap.js";
import DogStore from "./DogStore.js";

export default function() {
  // Helper Functions
  this.transformMouseCoordinate = ({ offsetX, offsetY }) => {
    const renderer = DogStore.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(offsetY / canvas.offsetHeight) * 2 + 1;
      return { x, y };
    }
    return { x: -999, y: -999 };
  };
  // Bind & Unbind
  this.bind = () => {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    const canvas = DogStore.stage3D.renderer.domElement;
    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("mouseup", this.onMouseUp);
    canvas.addEventListener("touchmove", this.onMouseMove);
    canvas.addEventListener("touchstart", this.onMouseDown);
    canvas.addEventListener("touchend", this.onMouseUp);
  };
  this.unbind = () => {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    const canvas = DogStore.stage3D.renderer.domElement;
    canvas.removeEventListener("mousemove", this.onMouseMove);
    canvas.removeEventListener("mousedown", this.onMouseDown);
    canvas.removeEventListener("mouseup", this.onMouseUp);
    canvas.removeEventListener("touchmove", this.onMouseMove);
    canvas.removeEventListener("touchstart", this.onMouseDown);
    canvas.removeEventListener("touchend", this.onMouseUp);
  };
  //
  this.onResize = debounce(evt => {
    DogStore.emit(DogStore.Event.resize, {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, 1000 / 10);
  /**
   *
   * Key Events
   *
   */
  this.onKeyDown = evt => {
    DogStore.emit(DogStore.Event.key_down, evt);
  };
  this.onKeyUp = evt => {
    DogStore.emit(DogStore.Event.key_up, evt);
  };
  /**
   *
   * Mouse Events
   *
   */
  this.onMouseMove = throttle(evt => {
    DogStore.emit(DogStore.Event.pointer_move, evt);
  }, 1000 / 40);
  this.onMouseDown = evt => {
    DogStore.emit(DogStore.Event.pointer_down, evt);
  };
  this.onMouseUp = evt => {
    DogStore.emit(DogStore.Event.pointer_up, evt);
  };
  /**
   *
   * Drag Events
   *
   */
  this.onDragEnter = evt => {
    DogStore.emit("drag_enter", evt);
    // this.openMouth(true);
    // this.dragZoom(true);
    // this.surprise(true);
    // TweenMax.delayedCall(1.2, () => this.surprise(false));
  };
  // like mousemove
  this.onDragOver = evt => {
    DogStore.emit("drag_over", evt);
  };
  this.onDrop = files => {
    DogStore.emit("drop", files);
  };
  this.onDragLeave = () => {
    DogStore.emit("drag_leave");
  };
}

//   this.dragZoom = bool => {
//     const duration = 0.5;
//     const camera = DogStore.stage3D.camera;
//     TweenMax.to(camera, duration, {
//       fov: bool ? 12 : 22,
//       onUpdate: () => {
//         camera.updateProjectionMatrix();
//       }
//     });
//     //
//     const orbitcontrols = DogStore.stage3D.orbitcontrols;
//     orbitcontrols.autoRotate = !bool;
//     orbitcontrols.enableRotate = !bool;
//     TweenMax.to(orbitcontrols.target, duration, {
//       y: bool ? 1 : 0
//     });
//     //
//     const wormAction = DogStore.stage3D.dog.animation.actions.worm;
//     if (wormAction) {
//       wormAction.weight = bool ? 0 : 1;
//     }
//     const wormIK = DogStore.stage3D.dog.ik.chains.worm;
//     if (wormIK) {
//       wormIK.influence = bool ? 0 : 0.1;
//     }
//     const vlegAction = DogStore.stage3D.dog.animation.actions.vleg;
//     vlegAction.weight = bool ? 0.1 : 1;
//   };
//   this.onDragEnter = () => {
//     this.openMouth(true);
//     this.dragZoom(true);
//     this.surprise(true);
//     TweenMax.delayedCall(1.2, () => this.surprise(false));
//   };
//   this.onDragStart = () => {
//     this.openMouth(true);
//     this.dragZoom(true);
//   };
//   this.onDrop = files => {
//     this.openMouth(false);
//     this.dragZoom(false);
//     this.surprise(false);
//     const eatParticles = DogStore.stage3D.dog.particles.systems.eat.config;
//     if (files && files[0] && files[0].name) {
//       eatParticles.emitter.sprite = files[0].name
//         .split("")
//         .filter(c => c !== " ")
//         .map(c => c.toLowerCase())
//         .map(c => ParticleTextureMap01[c])
//         .filter(v => !isNaN(v));
//       const open = () => {
//         this.openMouth(true, 0.1);
//         eatParticles.emitter.rate = 16;
//       };
//       const close = () => {
//         this.openMouth(false, 0.1);
//         eatParticles.emitter.rate = 0;
//       };
//       for (var i = 0; i < 10; i++) {
//         TweenMax.delayedCall(i * 0.2, open);
//         TweenMax.delayedCall(i * 0.2 + 0.1, close);
//       }
//       this.files.process(files[0]);
//       TweenMax.delayedCall((i + 1) * 0.2, () => {
//         this.files.start();
//       });
//     } else {
//       eatParticles.emitter.sprite = [0, 1];
//       this.openMouth(true);
//       TweenMax.delayedCall(0.5, () => {
//         this.confused(true);
//       });
//       TweenMax.delayedCall(2.8, () => {
//         this.confused(false);
//         this.openMouth(false);
//       });
//     }
//   };
//   this.onDragLeave = () => {
//     this.openMouth(false);
//     this.dragZoom(false);
//     this.surprise(false);
//   };
// }
