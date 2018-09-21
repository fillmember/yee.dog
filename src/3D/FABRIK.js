// ref: http://wiki.roblox.com/index.php?title=Inverse_kinematics#FABRIK

import { Vector3, Object3D, Math as Math3 } from "three";

const toRad = v => Math3.degToRad(v);
const last = arr => arr[arr.length - 1];

export class ConeConstraint {
  constructor(angle = 89) {
    this.left = toRad(angle);
    this.right = toRad(angle);
    this.top = toRad(angle);
    this.down = toRad(angle);
  }
}

export class FABRIK {
  constructor({
    joints,
    target,
    constraints,
    influence = 0.5,
    tolerance = 0.01,
    maxIterations = 2
  }) {
    if (!target) {
      target = new Object3D();
      last(joints).getWorldPosition(target.position);
    }
    this.references = {
      target: target,
      joints: joints
    };
    this.constraints = constraints || new ConeConstraint(89);
    this.tolerance = tolerance;
    this.influence = influence;
    this.maxIterations = maxIterations;
    this.needsUpdate = true;
    // Vectors
    this.target = this.references.target.getWorldPosition(new Vector3());
    this.joints = this.references.joints.map(j => {
      const pos = new Vector3();
      j.getWorldPosition(pos);
      return pos;
    });
    this.origin = this.joints[0].clone();
    this.lengths = this.joints.reduce((a, v1, index, arr) => {
      const v0 = arr[index - 1];
      if (v0) {
        a.push(v1.distanceTo(v0));
      }
      return a;
    }, []);
    this.totalLength = this.lengths.reduce((c, l) => c + l);
  }
  /*
  (public method)
  solve and apply
  refresh when needed
  */
  update() {
    if (this.needsUpdate) {
      this.refresh();
      this.needsUpdate = false;
    }
    this.solve();
    this.apply(this.influence);
  }
  /*
  apply
  since we are doing our FABRIK calculation in world position, and without rotation. 
  we have to use an additional process to apply the result back to joints,
  which are with local positions and rotations. 
  //
  I added in a "Slerp" function to help blend the IK results with other animation systems. 
  TODO: Let THREE.js Animation System handle this
  */
  apply(lerpAlpha = this.influence) {
    this.references.joints.forEach((j, i) => {
      let v = this.joints[i + 1] || this.target;
      const localChildPosition = j.parent.worldToLocal(v.clone());
      const q = j.quaternion.clone();
      j.lookAt(localChildPosition);
      j.rotateY(Math.PI);
      j.quaternion.slerp(q, 1 - lerpAlpha);
    });
  }

  getQuaternions() {
    const result = {};
    this.references.joints.forEach((j, i) => {
      let v = this.joints[i + 1] || this.target;
      const localChildPosition = j.parent.worldToLocal(v.clone());
      const origiQ = j.quaternion.clone();
      j.lookAt(localChildPosition);
      j.rotateY(Math.PI);
      const newQ = j.quaternion.clone();
      j.quaternion.copy(origiQ);
      result[j.name] = newQ;
    });
    return result;
  }

  solve() {
    // get target reference's position
    this.references.target.getWorldPosition(this.target);

    // distance
    const vector = new Vector3().subVectors(this.target, this.joints[0]);
    const outOfRange = vector.length() > this.totalLength;

    if (outOfRange) {
      let a = 0;
      const v = vector
        .clone()
        .normalize()
        .multiplyScalar(this.totalLength);
      this.joints.forEach((joint, index) => {
        if (index === 0) {
          return;
        }
        a += this.lengths[index - 1] / this.totalLength;
        joint.addVectors(this.joints[0], v.clone().multiplyScalar(a));
      });
    } else {
      let count = 0;
      let diff = this.joints[this.joints.length - 1].distanceTo(this.target);
      while (diff > this.tolerance && count < this.maxIterations) {
        this.backward();
        this.forward();
        diff = this.joints[this.joints.length - 1].distanceTo(this.target);
        count += 1;
      }
    }
  }
  /*
  Backward
  1. Set the end (N) joint at the target. 
  2. Find the line between N and N-1.
  3. Move N-1 on the line, and keep the original bone length to N
  4. Find the line between N-1 and N-2.
  5. Move N-2 on the line... (recursively)
  */
  backward() {
    last(this.joints).copy(this.target);
    for (let i = this.joints.length - 2; i >= 0; i--) {
      const joint = this.joints[i];
      const nextJoint = this.joints[i + 1];
      const distance = nextJoint.distanceTo(joint);
      const ratio = this.lengths[i] / distance;
      // mix the position of "joint" & "nextJoint" by (ratio) : (1 - ratio)
      const pos = nextJoint
        .clone()
        .multiplyScalar(1 - ratio)
        .add(joint.clone().multiplyScalar(ratio));
      // apply to this one
      joint.copy(pos);
    }
  }
  /*
  Forward
  1. Set the first joint at the origin. 
  2. Find the line between 0 and 1
  3. Move 1 on the line, and keep the original bone length to 0
  4. Find the line between 1 and 2
  5. Move 2 on the line... (recursively)
  */
  forward() {
    this.joints[0].copy(this.origin);
    const max = this.joints.length - 2;
    for (let i = 0; i <= max; i++) {
      const joint = this.joints[i];
      const nextJoint = this.joints[i + 1];
      const distance = nextJoint.distanceTo(joint);
      const ratio = this.lengths[i] / distance;
      // mix the position of "joint" & "nextJoint" by (1 - ratio) : (ratio)
      const pos = joint
        .clone()
        .multiplyScalar(1 - ratio)
        .add(nextJoint.clone().multiplyScalar(ratio));
      // apply to the next one
      nextJoint.copy(pos);
    }
  }
  /*
  refresh
  reload the current positions of the joints to vectors
  */
  refresh() {
    this.references.joints.forEach((j, i) =>
      j.getWorldPosition(this.joints[i])
    );
    this.references.target.getWorldPosition(this.target);
    this.origin = this.joints[0].clone();
  }
  /*
  constrain
  not sure what it does. 
  */
  constrain(calc, cone) {
    // calc : calculated of result form FABRIK algorithm
    // line : cone's center axis
    // cone : the cone matrix

    const line = new Vector3(0, 0, 1).applyMatrix4(cone);
    const scalar = calc.dot(line) / line.length();
    const proj = line
      .clone()
      .normalize()
      .multiplyScalar(scalar);

    // get axis that are closest
    const ups = [
      new Vector3(0, 1, 0).applyMatrix4(cone),
      new Vector3(0, -1, 0).applyMatrix4(cone)
    ];
    const downs = [
      new Vector3(1, 0, 0).applyMatrix4(cone),
      new Vector3(-1, 0, 0).applyMatrix4(cone)
    ];

    const sortFn = (a, b) => {
      const _a = a
        .clone()
        .sub(calc)
        .length();
      const _b = b
        .clone()
        .sub(calc)
        .length();
      return _a - _b;
    };
    const upvec = ups.sort(sortFn)[0];
    const rightvec = downs.sort(sortFn)[0];

    // get the vector from the projection to the calculated vector
    const adjust = new Vector3().subVectors(calc, proj);
    scalar < 0 && proj.negate();

    // get the 2D components
    const xaspect = adjust.dot(rightvec);
    const yaspect = adjust.dot(upvec);

    // get the cross section of the cone
    const left = -proj.length() * Math.tan(this.constraints.left);
    const right = proj.length() * Math.tan(this.constraints.right);
    const up = proj.length() * Math.tan(this.constraints.top);
    const down = -proj.length() * Math.tan(this.constraints.down);

    // find the quadrant
    const xbound = (xaspect >= 0 && right) || left;
    const ybound = (yaspect >= 0 && up) || down;

    const f = calc.clone();

    // check if in 2D point lies in the ellipse
    const ellipse =
      Math.pow(xaspect, 2) / Math.pow(xbound, 2) +
      Math.pow(yaspect, 2) / Math.pow(ybound, 2);
    const inbounds = ellipse <= 1 && scalar >= 0;

    if (!inbounds) {
      // get the angle of our out of ellipse point
      const a = Math.atan2(yaspect, xaspect);
      // find the nearest point
      const x = xbound * Math.cos(a);
      const y = ybound * Math.sin(a);
      // convert back to 3D
      f.copy(
        proj
          .clone()
          .add(rightvec.clone().multiplyScalar(x))
          .add(upvec.clone().multiplyScalar(y))
          .normalize()
          .multiplyScalar(calc.length())
      );
    }

    return f;
  }
}
