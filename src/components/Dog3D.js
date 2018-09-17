import {
  MeshLambertMaterial,
  LinearEncoding,
  Vector3,
  Math as Math3
} from "three";
import { TweenMax, Power2 } from "gsap";
import { IKSolver } from "./IK.js";
import { Animation } from "./Animation.js";
import BoneID from "./BoneID.js";
import ParticleSystem from "./ParticleSystem.js";

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
    this.ik = new IKSolver();
    this.ik.init({
      scene,
      mesh: dog,
      chains: {
        worm: {
          joints: [BoneID.Spine, BoneID.Shoulder, BoneID.Neck, BoneID.Head],
          constraints: [0, 0, 0],
          influence: 0
        },
        look: {
          joints: [BoneID.Neck, BoneID.Head],
          constraints: [0, 0, 0],
          influence: 0
        }
      }
    });
    // Animation
    this.animation = new Animation(dog);
    this.ik.createAnimationClips(this.animation);
    // Particles
    this.particles = new ParticleSystem({
      confused: {
        max: 16,
        parent: scene,
        emitter: {
          rate: 0.2,
          center: dog.skeleton.bones[BoneID.Head],
          extent: [1, 1, 1],
          offset: [0, 1, 0],
          velocity: () => [0, 0.01, 0],
          lifespan: () => 1 + Math.random() * 2,
          sprite: 51
        }
      },
      surprise: {
        max: 4,
        parent: dog.skeleton.bones[BoneID.Head],
        emitter: {
          size: 2,
          rate: 0.5,
          center: [0, 180, 0],
          lifespan: Infinity,
          sprite: 50
        }
      },
      digital: {
        max: 512,
        parent: scene,
        emitter: {
          size: () => Math3.randFloat(0.4, 0.8),
          rate: 1 / 60,
          center: dog.skeleton.bones[BoneID.Spine],
          extent: [0.1, 0.1, 0.1],
          lifespan: 4,
          sprite: [57, 56],
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
      }
    });
    //
  }
  update(dt) {
    this.ik.update(dt);
    this.animation.update(dt);
    this.particles.update(dt);
  }
  set debug(v) {
    this.ik.debug = v;
    this.dog.material.wireframe = v;
  }
  // Dog Behaviours
  bark(b) {
    const action = this.animation.actions.bark;
    TweenMax.to(action, 0.07, {
      time: b ? 1 : 0,
      ease: Power2.easeOut
    });
  }
}
