// ref: http://wiki.roblox.com/index.php?title=Inverse_kinematics#FABRIK
import { Vector3, Object3D } from "three";

const last = (arr) => arr[arr.length - 1];

class Node {
  reference;
  constructor(reference) {
    this.reference = reference;
    this.alignWithReference();
  }
  position = new Vector3();
  alignWithReference() {
    this.reference.getWorldPosition(this.position);
  }
  set(v3) {
    this.position.copy(v3);
    this.reference.position.copy(v3);
  }
}

class Joint extends Node {
  static noop = (ref) => ref;
  static negY = (ref) => ref.rotateY(Math.PI);
  constructor({ reference }) {
    super(reference);
  }
  localToWorldDirection(direction) {
    if (this.reference.parent) {
      const parent = this.reference.parent.matrixWorld;
      direction.transformDirection(parent);
    }
    return direction;
  }
  _direction_v = new Vector3();
  get direction() {
    return this.reference.getWorldDirection(this._direction_v);
  }
  set direction(v) {
    const wp = this.reference.getWorldPosition(this._direction_v);
    wp.add(v);
    this.reference.lookAt(wp);
  }
}

class Target extends Node {}

class Solver {
  chains;
  constructor(chains) {
    this.chains = chains;
  }
}

class Chain {
  influence;
  tolerance;
  maxIterations;
  target;
  joints;
  lengths: number[];
  totalLength: number;
  constructor({ joints, target, influence = 0.5 }: any) {
    if (!target) {
      target = new Object3D();
      last(joints).getWorldPosition(target.position);
    }
    if (
      !joints.every((joint, index, arr) => {
        const next = arr[index + 1];
        if (next) {
          return joint.children.indexOf(next) > -1;
        } else {
          return true;
        }
      })
    ) {
      console.warn(
        "FABRIK.Chain assumes the bones are in hierarchy. (start -> end). Please check your input. "
      );
    }
    this.influence = influence;
    this.tolerance = 0.01;
    this.maxIterations = 5;
    // Vectors
    this.target = new Target(target);
    this.joints = joints.map(
      (obj3d, index) =>
        new Joint({
          reference: obj3d,
        })
    );
    this.lengths = this.joints.reduce((a, v1, index, arr) => {
      const v0 = arr[index - 1];
      if (v0) {
        a.push(v1.position.distanceTo(v0.position));
      }
      return a;
    }, []);
    this.totalLength = this.lengths.reduce((c, l) => c + l);
  }
  alignReferenceToJoint({ alpha, returnQuaternions }) {
    const result = {};
    const references = this.joints.map((j) => j.reference);
    const originalQuaternions = references.map((ref) => ref.quaternion.clone());
    // Get result quaternions
    references.forEach((ref, i) => {
      let v = this.joints[i + 1] || this.target;
      ref.lookAt(v.position);
      ref.quaternion.slerp(originalQuaternions[i], 1 - this.influence);
      if (returnQuaternions) {
        result[ref.name] = ref.quaternion.clone();
      }
    });
    // Set reference quaternions back
    if (alpha === 0) {
      references.forEach((ref, i) =>
        ref.quaternion.copy(originalQuaternions[i])
      );
    } else {
      references.forEach((ref, i) =>
        ref.quaternion.slerp(originalQuaternions[i], 1 - alpha)
      );
    }
    if (returnQuaternions) {
      return result;
    }
  }
  /*
  apply
  since we are doing our FABRIK calculation in world position, and without rotation.
  we have to use an additional process to apply the results back to the actual joints,
  which are with local positions and rotations.
  */
  apply(alpha = this.influence) {
    return this.alignReferenceToJoint({
      alpha,
      returnQuaternions: false,
    });
  }
  /*
  getQuaternions
  same as apply, but instead of setting joints, get the rotated values as quaternions.
  */
  getQuaternions() {
    return this.alignReferenceToJoint({
      alpha: 0,
      returnQuaternions: true,
    });
  }
  /*
  Solve
  1. check if target is out of reach
  2. if yes, arrange joints into a straight line pointing towards target.
  3. if no, do backward & forward pass until getting close enough.
  */
  solve() {
    // distance
    const fromStartToEnd = new Vector3().subVectors(
      this.target.position,
      this.joints[0].position
    );
    const outOfRange = fromStartToEnd.length() > this.totalLength;
    if (outOfRange) {
      let a = 0;
      const v = fromStartToEnd
        .clone()
        .normalize()
        .multiplyScalar(this.totalLength);
      this.joints.forEach((joint, index) => {
        if (index === 0) {
          return;
        }
        a += this.lengths[index - 1] / this.totalLength;
        joint.position.addVectors(
          this.joints[0].position,
          v.clone().multiplyScalar(a)
        );
      });
    } else {
      let count = 0;
      let diff = last(this.joints).position.distanceTo(this.target);
      while (diff > this.tolerance && count < this.maxIterations) {
        this.backward();
        this.forward();
        diff = last(this.joints).position.distanceTo(this.target);
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
    this.joints[0].alignWithReference();
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
  alignWithReference
  reload the current positions of the joints to vectors
  */
  alignAllWithReference() {
    this.target.alignWithReference();
    this.joints.forEach((j) => j.alignWithReference());
  }
}

export default {
  Chain,
  Solver,
};
