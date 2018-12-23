import { action, observable } from "mobx";
import DoggoBehaviour from "./DoggoBehaviour";
import Bark from "./bark";
import OrbitControl from "./orbitcontrol";
import ParticleSystem from "./particleSystem";
import BaseMouseTo3D from "./baseMouseTo3D";
import { ParticleTextureMap01 } from "../3D/ParticleTextureMap";

export default class EatYourFiles extends DoggoBehaviour {
  extraDogState = {
    countFileEaten: 0,
    countConfused: 0
  };
  dragZoom = bool => {
    const duration = 0.5;
    const camera = this.DogStore.stage3D.camera;
    TweenMax.to(camera, duration, {
      fov: bool ? 12 : 22,
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    });
    if (this.behaviourOrbitControl) {
      const orbitcontrols = this.behaviourOrbitControl.orbitcontrols;
      orbitcontrols.autoRotate = !bool;
      orbitcontrols.enableRotate = !bool;
      TweenMax.to(orbitcontrols.target, duration, {
        y: bool ? 1 : 0
      });
    }
  };
  bark = bool => this.behaviourBark && this.behaviourBark.bark(bool);
  getParticleSystemConfig(name) {
    const behaviour = this.behaviourParticleSystem;
    const config = behaviour ? behaviour.config[name] : null;
    return config;
  }
  surprise = bool => {
    const config = this.getParticleSystemConfig("surprise");
    if (config) {
      config.emitter.rate = bool ? 2 : 0;
    }
  };
  confused = (
    bool,
    { particles = ParticleTextureMap01["?"], count = 4 } = {}
  ) => {
    const config = this.getParticleSystemConfig("confused");
    if (config) {
      config.emitter.sprite = particles;
      config.emitter.rate = bool ? count : 0;
    }
  };
  afterDrop = () => {
    const { countFileEaten } = this.extraDogState;
    if (countFileEaten >= 3) {
      this.confused(true, {
        particles: ParticleTextureMap01["❤"],
        count: 2
      });
      TweenMax.delayedCall(4, () => {
        this.confused(false);
      });
      this.extraDogState.countFileEaten = 0;
    }
  };
  onDogReady() {
    this.on("drag_enter", this.onDragEnter);
    this.on("drag_over", this.onDragOver);
    this.on("drag_start", this.onDragStart);
    this.on("drop", this.onDrop);
    this.on("drag_leave", this.onDragLeave);
    // find depending behaviours
    this.behaviourBark = this.require(Bark);
    this.behaviourOrbitControl = this.require(OrbitControl);
    this.behaviourParticleSystem = this.require(ParticleSystem);
    this.behaviourBaseMouseTo3D = this.require(BaseMouseTo3D);
  }
  onRemove() {
    this.off("drag_enter", this.onDragEnter);
    this.off("drag_over", this.onDragOver);
    this.off("drag_start", this.onDragStart);
    this.off("drop", this.onDrop);
    this.off("drag_leave", this.onDragLeave);
  }
  onDragEnter = () => {
    this.bark(true);
    this.dragZoom(true);
    this.surprise(true);
    TweenMax.delayedCall(1.2, () => this.surprise(false));
  };
  onDragStart = () => {
    this.bark(true);
    this.dragZoom(true);
  };
  onDragOver = evt => {
    this.behaviourBaseMouseTo3D.onPointerMove(evt.nativeEvent);
  };
  onDrop = files => {
    this.bark(false);
    this.dragZoom(false);
    this.surprise(false);
    const eatParticles = this.getParticleSystemConfig("eat");
    if (files && files[0] && files[0].name) {
      eatParticles.emitter.sprite = files[0].name
        .split("")
        .filter(c => c !== " ")
        .map(c => c.toLowerCase())
        .map(c => ParticleTextureMap01[c])
        .filter(v => !isNaN(v));
      const open = () => {
        this.bark(true, 0.1);
        eatParticles.emitter.rate = 16;
      };
      const close = () => {
        this.bark(false, 0.1);
        eatParticles.emitter.rate = 0;
      };
      for (var i = 0; i < 10; i++) {
        TweenMax.delayedCall(i * 0.2, open);
        TweenMax.delayedCall(i * 0.2 + 0.1, close);
      }
      TweenMax.delayedCall(i * 0.2 + 0.2, this.afterDrop);
      this.extraDogState.countFileEaten += 1;
    } else {
      eatParticles.emitter.sprite = [0, 1];
      this.bark(true);
      TweenMax.delayedCall(0.5, () => {
        this.confused(true);
      });
      TweenMax.delayedCall(2.8, () => {
        this.confused(false);
        this.bark(false);
        this.afterDrop();
      });
      this.extraDogState.countConfused += 1;
    }
  };
  onDragLeave = () => {
    this.bark(false);
    this.dragZoom(false);
    this.surprise(false);
  };
}
