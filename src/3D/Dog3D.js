import { MeshLambertMaterial, LinearEncoding, Math as Math3 } from "three";
import { TweenMax, Power2 } from "gsap";
import { DogIK } from "./IK.js";
import { Animation } from "./Animation.js";
import BoneID from "./BoneID.js";
import ParticleSystem from "./ParticleSystem.js";
import { Clips, Actions } from "./AnimationData.js";

export default class Dog3D {
  constructor({ obj3d, scene }) {
    const dog = (this.dog = obj3d);
    // correct material
    dog.material.map.encoding = LinearEncoding;
    const mat = new MeshLambertMaterial({
      color: 0x444444,
      map: dog.material.map,
      skinning: true,
      emissive: 0xffffff,
      emissiveMap: dog.material.map
    });
    dog.material = mat;
    dog.position.y = -0.4;
    // IK
    this.ik = new DogIK();
    this.ik.init({
      scene,
      mesh: dog,
      chains: {
        worm: {
          joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck],
          constraints: [40, 15, 10],
          influence: 0.1,
          clipWeight: 1
        },
        look: {
          joints: [BoneID.Neck, BoneID.Head],
          constraints: [35, 20],
          influence: 0.1,
          clipWeight: 1
        }
      }
    });
    // Animation
    this.animation = new Animation(this.dog);
    this.ik.createAnimationClips();
    this.ik.createAnimationActions(this.animation);
    this.animation.clips(Clips);
    this.animation.actions(Actions);
    // Particles
    this.particles = new ParticleSystem({
      confused: {
        max: 16,
        parent: scene,
        emitter: {
          enabled: true,
          rate: 0,
          center: dog.skeleton.bones[BoneID.Head],
          extent: [1, 1, 1],
          offset: [0, 1, 0],
          velocity: [0, 0.01, 0],
          lifespan: () => 1 + Math.random() * 2,
          sprite: 37
        }
      },
      surprise: {
        max: 4,
        parent: dog.skeleton.bones[BoneID.Head],
        emitter: {
          enabled: true,
          size: 2,
          rate: 0,
          center: [0, 180, 0],
          lifespan: 0.8,
          sprite: 36
        }
      },
      digital: {
        max: 512,
        parent: scene,
        emitter: {
          enabled: true,
          size: () => Math3.randFloat(0.4, 0.8),
          rate: 0,
          center: dog.skeleton.bones[BoneID.Spine],
          extent: [0.1, 0.1, 0.1],
          sprite: [0, 1],
          velocity: () => {
            const a = 0.05;
            return [
              Math3.randFloat(-a, a),
              Math3.randFloat(-a, a),
              Math3.randFloat(-a, a)
            ];
          },
          lifespan: () => Math3.randFloat(0.5, 2)
        }
      },
      eat: {
        max: 64,
        parent: scene,
        emitter: {
          enabled: true,
          size: 0.6,
          rate: 0,
          center: dog.skeleton.bones[BoneID.JawU_1],
          extend: [0.4, 0.1, 0.5],
          offset: [0, -0.1, 1],
          sprite: [0, 1],
          velocity: () => [
            Math.random() > 0.5 ? -0.03 : 0.03,
            Math3.randFloat(-0.02, 0.02),
            Math3.randFloat(-0.01, -0.05)
          ],
          acceleration: [0, -0.005, 0],
          lifespan: 0.7
        }
      }
    });
    //
  }
  update(dt) {
    this.ik.update(dt);
    this.animation.update(dt);
    this.particles.update(dt);
  }
  // Dog Behaviours
  lookAt(vector3) {
    this.ik.chains.look.target.set(vector3);
    this.ik.chains.worm.target.set(vector3);
    const action = this.animation.actions.vleg;
    TweenMax.to(action, 0.8, {
      time: vector3.y < 0 ? 1 : 0
    });
  }
  openMouth(b, duration = 0.2) {
    const action = this.animation.actions.bark;
    TweenMax.to(action, duration, {
      time: b ? 1 : 0,
      ease: Power2.easeOut
    });
  }
  //
  onFileStart() {}
  onFileProcess() {}
}
