export class Force {
  constructor() {
    this.active = true;
    this.priority = 0;
  }

  influence(iter, positions, velocities, accelerations) {
    return [0, 0, 0];
  }
}
