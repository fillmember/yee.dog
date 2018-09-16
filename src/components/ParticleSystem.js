import { Texture, Math as Math3 } from "three";
import PARTICLE_TEXTURE from "./particle_tex_0.png";
import Particle from "three-proto-particle";
const lerp = Math3.lerp;
const pi2 = Math.PI * 2;
class MyForce {
  constructor(count) {
    this.count = count;
    this.active = true;
    this.priority = 0;
    this.ages = new Array(count).fill(0);
    this.steps = this.ages.map(this.getStep);
    this.xs = this.ages.map(this.getX);
    this.ys = this.ages.map(this.getY);
    this.zs = this.ages.map(this.getZ);
    this.radius = 350;
  }
  getStep() {
    return Math3.randFloat(0.001, 0.01);
  }
  getX() {
    return Math3.randFloat(-100, 100);
  }
  getY() {
    return Math3.randFloat(200, 400);
  }
  getZ() {
    return Math3.randFloat(-100, 100);
  }
  influence(iter, positions, velocities, accelerations) {
    const age = this.ages[iter];
    const expire = age > 1;
    if (expire) {
      this.ages[iter] = 0;
      this.steps[iter] = this.getStep();
      this.xs[iter] = this.getX();
      this.ys[iter] = this.getY();
      this.zs[iter] = this.getZ();
    } else {
      this.ages[iter] = age + this.steps[iter];
      positions[iter] = lerp(this.xs[iter] * 0.7, this.xs[iter], age);
      positions[iter + 1] = lerp(0, this.ys[iter], age);
      positions[iter + 2] = lerp(this.zs[iter] * 0.8, this.zs[iter], age);
    }
  }
}

export default class ParticleSystem {
  constructor(parent) {
    const count = 32;
    const texture = new Texture();
    const system = new Particle.System(
      new Particle.Geometry(count),
      new Particle.BillboardMaterial({
        texture,
        transparent: true,
        depthWrite: false,
        columns: 8,
        rows: 8
      })
    );
    const img = new Image();
    img.onload = () => {
      texture.needsUpdate = true;
      system.material.needsUpdate = true;
    };
    texture.image = img;
    img.src = PARTICLE_TEXTURE;
    this.force = new MyForce(count);
    system.forces.push(this.force);
    parent.add(system);
    for (let i = 0; i < count; i++) {
      system.addParticle([0, 0, 0], {
        size: 0.8,
        sprite: 51
      });
    }
    this.system = system;
    this.head();
  }
  update(dt) {
    this.system.update(dt);
  }
  // behaviours
  head() {
    this.system.position.set(0, 70, -200);
  }
  body() {
    this.system.position.set(0, 0, 0);
  }
}
