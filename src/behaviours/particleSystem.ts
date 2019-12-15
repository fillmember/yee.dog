import { Math as Math3 } from "three";
import DoggoBehaviour from "./DoggoBehaviour";
import ParticleSystem3D from "../3D/ParticleSystem";
import BoneID from "../3D/BoneID";

class ParticleSystem extends DoggoBehaviour {
  config;
  particles;
  onDogReady(dog) {
    const scene = this.DogStore.stage3D.scene;
    this.config = {
      confused: {
        max: 16,
        parent: scene,
        emitter: {
          enabled: true,
          rate: 0,
          center: dog.mesh.skeleton.bones[BoneID.Head],
          extent: [1, 1, 1],
          offset: [0, 1, 0],
          velocity: [0, 0.01, 0],
          lifespan: () => 1 + Math.random() * 2,
          sprite: 37
        }
      },
      surprise: {
        max: 4,
        parent: dog.mesh.skeleton.bones[BoneID.Head],
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
          center: dog.mesh.skeleton.bones[BoneID.Spine],
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
          center: dog.mesh.skeleton.bones[BoneID.JawU_1],
          extend: [0.4, 0.1, 0.5],
          offset: [0, -0.1, 0.9],
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
    };
    this.particles = new ParticleSystem3D(this.config);
    this.on("update", this.onUpdate);
  }
  onUpdate = dt => {
    this.particles.update(dt);
  };
}

export default ParticleSystem;
