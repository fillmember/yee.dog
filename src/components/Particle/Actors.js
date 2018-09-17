import { Force } from "./Force.js";

export class Attractor extends Force {
  constructor(px = 0, py = 0, pz = 0, mass = 100, spread = 1.5, deadzone = 1) {
    super();
    this.x = px;
    this.y = py;
    this.z = pz;

    this.mass = mass / 1000;
    this.spread = spread;
    this.deadzone = deadzone;
  }

  influence(iter, positions, velocities, accelerations) {
    var dx = this.x - positions[iter + 0];
    var dy = this.y - positions[iter + 1];
    var dz = this.z - positions[iter + 2];

    /* don't ask me why, but in V8 this is faster than omitting the math.max */
    var cdx = Math.max(dx * dx, this.deadzone);
    var cdy = Math.max(dy * dy, this.deadzone);
    var cdz = Math.max(dz * dz, this.deadzone);

    var force = this.mass / Math.pow(cdx + cdy + cdz, this.spread);

    accelerations[iter + 0] += dx * force;
    accelerations[iter + 1] += dy * force;
    accelerations[iter + 2] += dz * force;
  }
}

export class Jet extends Force {
  constructor(
    px = 0,
    py = 0,
    pz = 0,
    mass = 100,
    spread = 1.5,
    deadzone = 1,
    dx,
    dy,
    dz
  ) {
    super();
    this.x = px;
    this.y = py;
    this.z = pz;

    this.dx = dx;
    this.dy = dy;
    this.dz = dz;

    this.mass = mass / 1000;
    this.spread = spread;
    this.deadzone = deadzone;
  }
  // eslint-disable-next-line
  influence(iter, positions, velocities, accelerations) {
    var dx = this.x - positions[iter + 0];
    var dy = this.y - positions[iter + 1];
    var dz = this.z - positions[iter + 2];

    /* don't ask me why, but in V8 this is faster than omitting the math.max */
    var cdx = Math.max(dx * dx, this.deadzone);
    var cdy = Math.max(dy * dy, this.deadzone);
    var cdz = Math.max(dz * dz, this.deadzone);

    var force = this.mass / Math.pow(cdx + cdy + cdz, this.spread);

    accelerations[iter + 0] += Math.abs(dx * force) * this.dx;
    accelerations[iter + 1] += Math.abs(dy * force) * this.dy;
    accelerations[iter + 2] += Math.abs(dz * force) * this.dz;
  }
}

export class Limit extends Force {
  constructor(vmx = 0.0981, vmy = 0.0981, vmz = 0.0981) {
    super();
    this.x = vmx;
    this.y = vmy;
    this.z = vmz;
  }

  influence(iter, positions, velocities, accelerations) {
    velocities[iter + 0] = Math.max(
      Math.min(velocities[iter + 0], this.x),
      -this.x
    );
    velocities[iter + 1] = Math.max(
      Math.min(velocities[iter + 1], this.y),
      -this.y
    );
    velocities[iter + 2] = Math.max(
      Math.min(velocities[iter + 2], this.z),
      -this.z
    );

    accelerations[iter + 0] = Math.max(
      Math.min(accelerations[iter + 0], this.x),
      -this.x
    );
    accelerations[iter + 1] = Math.max(
      Math.min(accelerations[iter + 1], this.y),
      -this.y
    );
    accelerations[iter + 2] = Math.max(
      Math.min(accelerations[iter + 2], this.z),
      -this.z
    );
  }
}

export class Gravity extends Force {
  constructor(ax = 0, ay = -0.0981 / 60, az = 0) {
    super();
    this.x = ax;
    this.y = ay;
    this.z = az;
  }

  influence(iter, positions, velocities, accelerations) {
    accelerations[iter + 0] += this.x;
    accelerations[iter + 1] += this.y;
    accelerations[iter + 2] += this.z;
  }
}

export class Friction extends Force {
  constructor(fx = 0.5, fy = 0.5, fz = 0.5) {
    super();
    this.x = fx;
    this.y = fy;
    this.z = fz;
  }
  // eslint-disable-next-line
  influence(iter, positions, velocities, accelerations) {
    velocities[iter + 0] *= this.x;
    velocities[iter + 1] *= this.y;
    velocities[iter + 2] *= this.z;
  }
}

export class Floor extends Force {
  constructor(y = 0, strength = 0.9) {
    super();
    this.y = y;
    this.strength = strength;
  }
  // eslint-disable-next-line
  influence(iter, positions, velocities, accelerations) {
    if (positions[iter + 1] <= this.y) {
      positions[iter + 1] = this.y;
      velocities[iter + 1] *= -this.strength;
      // accelerations[ iter + 1 ] = 0
    }
  }
}
