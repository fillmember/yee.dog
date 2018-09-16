// import Emitter from "./Particle/Emitter.js";
// const lerp = Math3.lerp;
// const pi2 = Math.PI * 2;
// class MyForce {
//   constructor(count) {
//     this.active = true;
//     //
//     this.count = count;
//     this.radius = 350;
//     this.enable();
//     //
//     this.mode = "heademit";
//   }
//   getStep() {
//     return Math3.randFloat(0.003, 0.01);
//   }
//   getX() {
//     return Math3.randFloat(-1, 1);
//   }
//   getY() {
//     return Math3.randFloat(0.5, 1.5);
//   }
//   getZ() {
//     return Math3.randFloat(-0.2, 0.4);
//   }
//   enable() {
//     this.active = true;
//     this.ages = new Array(this.count).fill(0);
//     this.steps = this.ages.map(this.getStep);
//     this.xs = this.ages.map(this.getX);
//     this.ys = this.ages.map(this.getY);
//     this.zs = this.ages.map(this.getZ);
//   }
//   disable() {
//     this.active = false;
//   }
//   noop() {}
//   heademit(_i, pos, vel, acc) {
//     const age = this.ages[_i];
//     const birth = age === 0;
//     const death = age > 1;
//     if (death) {
//       this.ages[_i] = 0;
//       this.steps[_i] = this.getStep();
//       this.xs[_i] = this.getX();
//       this.ys[_i] = this.getY();
//       this.zs[_i] = this.getZ();
//       pos[_i] = 0;
//       pos[_i + 1] = 0;
//       pos[_i + 2] = 0;
//       return;
//     } else if (birth) {
//       vel[_i] = this.xs[_i];
//       vel[_i + 1] = this.ys[_i];
//       vel[_i + 2] = this.zs[_i];
//       this.ages[_i] = age + this.steps[_i];
//     } else {
//       this.ages[_i] = age + this.steps[_i];
//     }
//   }
//   influence(...args) {
//     if (!this.active) {
//       return;
//     }
//     this[this.mode](...args);
//   }
// }

// // behaviours
// head() {
//   this.reparent();
//   this.system.position.set(0, 70, -200);
// }
// abovehead() {
//   this.reparent();
//   TweenMax.fromTo(
//     this.system.position,
//     0.2,
//     {
//       x: 0,
//       y: 200,
//       z: -220
//     },
//     {
//       y: 270,
//       ease: Elastic.easeOut.config(0.5, 0.5)
//     }
//   );
// }
// body() {
//   this.reparent();
//   this.system.position.set(0, 0, 0);
// }
// none() {
//   this.system.visible = false;
//   this.force.mode = "noop";
// }
// heademit(...args) {
//   this.system.visible = true;
//   this.head();
//   this.force.mode = "heademit";
//   this.setSprites(...args);
//   this.system.geometry.attributes.size.array.fill(1);
//   this.system.geometry.attributes.size.needsUpdate = true;
// }
// surprise(...args) {
//   this.system.visible = true;
//   this.abovehead();
//   this.force.mode = "noop";
//   this.setSprites(...args);
//   this.system.velocities.fill(0);
//   this.system.accelerations.fill(0);
//   this.setAttribute("translate", 0);
//   this.system.geometry.attributes.size.array.fill(0);
//   this.system.geometry.attributes.size.array[0] = 1;
//   this.system.geometry.attributes.size.needsUpdate = true;
// }

// this.force = new MyForce(this.count);
// this.system.forces.push(this.force);
// default action
// this.heademit(51);
// window.dami = this;


// helpers
  setAttribute(attribute, ...args) {
    if (args.length === 0) {
      return this.setSprites(...new Array(64).fill(0).map((v, index) => index));
    } else if (args.length === 1) {
      this.system.geometry.attributes[attribute].array.fill(args[0]);
      this.system.geometry.attributes[attribute].needsUpdate = true;
    } else {
      const rndIndex = () => Math3.randInt(0, args.length - 1);
      this.system.geometry.attributes[
        attribute
      ].array = this.system.geometry.attributes.translate.array.map(
        (v, index) => {
          return args[rndIndex()];
        }
      );
      this.system.geometry.attributes[attribute].needsUpdate = true;
    }
  }
  setSprites(...args) {
    this.setAttribute("sprite", ...args);
  }
  reparent(options = {}) {
    const parent = options.parent || this.parent;
    if (parent !== this.system.parent) {
      parent.add(this.system);
      if (options.position) {
        this.system.position.copy(options.position);
      }
    }
  }