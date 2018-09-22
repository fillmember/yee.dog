import { Object3D, AnimationClip, NumberKeyframeTrack, Euler } from "three";
import { Animation } from "./Animation.js";
import { FABRIK, ConeConstraint } from "./FABRIK.js";

export class IKTarget extends Object3D {
  constructor(mimicTarget) {
    super();
    if (mimicTarget) {
      mimicTarget.getWorldPosition(this.position);
    }
    this.userData.initialPosition = this.position.clone();
    return this;
  }
  reset() {
    this.position.copy(this.userData.initialPosition);
  }
}

export class IKSolver {
  init(config) {
    this.config = config;
    const { mesh, chains } = this.config;
    this.clips = {};
    this.mesh = mesh;
    this.mesh.updateMatrixWorld();
    this.chains = {};
    Object.keys(chains).forEach(key => {
      const chain = chains[key];
      const { joints, influence, constraints } = chain;
      const bones = joints.map(boneID => this.mesh.skeleton.bones[boneID]);
      this.chains[key] = new FABRIK({
        joints: bones,
        influence,
        constraints: constraints
          ? constraints.map(value => new ConeConstraint(value))
          : undefined
      });
    });
  }
  update() {
    for (let key in this.chains) {
      const chain = this.chains[key];
      chain.refresh();
      chain.solve();
      const quaternions = chain.getQuaternions();
      this.clips[key].tracks.forEach(track => {
        const { object, axis } = Animation.parsePath(track.name);
        const q = quaternions[object];
        if (!q) {
          return;
        }
        const e = new Euler().setFromQuaternion(q);
        if (isNaN(e[axis])) {
          return;
        }
        track.values[0] += (e[axis] - track.values[0]) * chain.influence;
        track.values[1] = track.values[0];
      });
    }
  }
  createAnimationClips() {
    for (let key in this.config.chains) {
      const config = this.config.chains[key];
      const tracks = config.joints.reduce((a, boneID) => {
        const name = this.mesh.skeleton.bones[boneID].name;
        return [
          ...a,
          new NumberKeyframeTrack(
            Animation.path(name, "rotation[x]"),
            [0, 1],
            [0, 0]
          ),
          new NumberKeyframeTrack(
            Animation.path(name, "rotation[y]"),
            [0, 1],
            [0, 0]
          ),
          new NumberKeyframeTrack(
            Animation.path(name, "rotation[z]"),
            [0, 1],
            [0, 0]
          )
        ];
      }, []);
      const clip = new AnimationClip(key, 1, tracks);
      this.clips[key] = clip;
      this.mesh.animations = this.mesh.animations || [];
      this.mesh.animations.push(clip);
    }
  }
  createAnimationActions(animation) {
    Object.keys(this.clips).forEach(key => {
      animation.actions({
        [key]: {
          zeroSlopeAtEnd: false,
          zeroSlopeAtStart: false,
          weight: this.config.chains[key].clipWeight
        }
      });
    });
  }
}