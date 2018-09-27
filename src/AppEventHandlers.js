import { TweenMax } from "gsap";
import { ParticleTextureMap01 } from "./3D/ParticleTextureMap.js";
export default function() {
  // Helper Functions
  this.transformMouseCoordinate = ({ offsetX, offsetY }) => {
    const renderer = this.state.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(offsetY / canvas.offsetHeight) * 2 + 1;
      return { x, y };
    }
    return { x: -999, y: -999 };
  };
  this.bark = bool => {
    this.state.stage3D.dog && this.state.stage3D.dog.openMouth(bool);
    this.audio.bark(bool);
  };
  this.openMouth = bool => {
    this.state.stage3D.dog && this.state.stage3D.dog.openMouth(bool);
  };
  // Bind & Unbind
  this.bind = () => {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    const canvas = this.state.stage3D.renderer.domElement;
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
    const canvas = this.state.stage3D.renderer.domElement;
    canvas.removeEventListener("mousemove", this.onMouseMove);
    canvas.removeEventListener("mousedown", this.onMouseDown);
    canvas.removeEventListener("mouseup", this.onMouseUp);
    canvas.removeEventListener("touchmove", this.onMouseMove);
    canvas.removeEventListener("touchstart", this.onMouseDown);
    canvas.removeEventListener("touchend", this.onMouseUp);
  };
  // Event Handlers
  this.onResize = () => {
    this.state.stage3D.resize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  //
  const pressedKeys = {};
  this.onKeyDown = evt => {
    switch (evt.keyCode) {
      case 32:
        if (pressedKeys[32] === true) {
          return;
        }
        pressedKeys[32] = true;
        this.bark(true);
        break;
      default:
        break;
    }
  };
  this.onKeyUp = evt => {
    switch (evt.keyCode) {
      case 32:
        pressedKeys[32] = false;
        this.bark(false);
        break;
      default:
        break;
    }
  };
  //
  this.onMouseMove = evt => {
    const renderer = this.state.stage3D.renderer;
    if (renderer) {
      const canvas = renderer.domElement;
      const x = (evt.offsetX / canvas.offsetWidth) * 2 - 1;
      const y = -(evt.offsetY / canvas.offsetHeight) * 2 + 1;
      this.state.stage3D.updatePointer({ x, y });
    }
  };
  this.onMouseDown = evt => {
    this.onMouseMove(evt);
    this.bark(true);
  };
  this.onMouseUp = evt => {
    this.onMouseMove(evt);
    this.bark(false);
  };
  //
  this.onDragOver = evt => {
    const mouse = this.transformMouseCoordinate({
      offsetX: evt.nativeEvent.offsetX * 1.8,
      offsetY: evt.nativeEvent.offsetY * 1.8
    });
    mouse.y += 0.3;
    this.state.stage3D.updatePointer(mouse);
  };
  this.dragZoom = bool => {
    const duration = 0.5;
    const camera = this.state.stage3D.camera;
    TweenMax.to(camera, duration, {
      fov: bool ? 12 : 22,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    });
    //
    const orbitcontrols = this.state.stage3D.orbitcontrols;
    orbitcontrols.autoRotate = !bool;
    orbitcontrols.enableRotate = !bool;
    TweenMax.to(orbitcontrols.target, duration, {
      y: bool ? 1 : 0
    });
    //
    const wormAction = this.state.stage3D.dog.animation.actions.worm;
    wormAction.weight = bool ? 0 : 1;
    const vlegAction = this.state.stage3D.dog.animation.actions.vleg;
    vlegAction.weight = bool ? 0.1 : 1;
    const wormIK = this.state.stage3D.dog.ik.chains.worm;
    wormIK.influence = bool ? 0 : 0.1;
  };
  this.surprise = bool => {
    TweenMax.to(
      this.state.stage3D.dog.particles.systems.surprise.config.emitter,
      bool ? 0.5 : 0,
      {
        rate: bool ? 2 : 0
      }
    );
  };
  this.confused = bool => {
    TweenMax.to(
      this.state.stage3D.dog.particles.systems.confused.config.emitter,
      0,
      {
        rate: bool ? 4 : 0
      }
    );
  };
  this.onDragEnter = () => {
    this.openMouth(true);
    this.dragZoom(true);
    this.surprise(true);
    TweenMax.delayedCall(1.2, () => this.surprise(false));
  };
  this.onDragStart = () => {
    this.openMouth(true);
    this.dragZoom(true);
  };
  this.onDrop = files => {
    this.openMouth(false);
    this.dragZoom(false);
    this.surprise(false);
    const eatParticles = this.state.stage3D.dog.particles.systems.eat.config;
    if (files && files[0] && files[0].name) {
      eatParticles.emitter.sprite = files[0].name
        .split("")
        .filter(c => c !== " ")
        .map(c => c.toLowerCase())
        .map(c => ParticleTextureMap01[c])
        .filter(v => !isNaN(v));
      const open = () => {
        this.openMouth(true, 0.1);
        eatParticles.emitter.rate = 16;
      };
      const close = () => {
        this.openMouth(false, 0.1);
        eatParticles.emitter.rate = 0;
      };
      for (var i = 0; i < 10; i++) {
        TweenMax.delayedCall(i * 0.2, open);
        TweenMax.delayedCall(i * 0.2 + 0.1, close);
      }
      this.files.process(files[0]);
      TweenMax.delayedCall((i + 1) * 0.2, () => {
        this.files.start();
      });
    } else {
      eatParticles.emitter.sprite = [0, 1];
      this.openMouth(true);
      TweenMax.delayedCall(0.5, () => {
        this.confused(true);
      });
      TweenMax.delayedCall(2.8, () => {
        this.confused(false);
        this.openMouth(false);
      });
    }
  };
  this.onDragLeave = () => {
    this.openMouth(false);
    this.dragZoom(false);
    this.surprise(false);
  };
}
