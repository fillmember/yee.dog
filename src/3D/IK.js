import {
  Object3D,
  AnimationClip,
  AxesHelper,
  NumberKeyframeTrack,
  Euler
} from "three";
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
  set debug(v) {
    if (this.userData.helper) {
      this.userData.helper.visible = v;
    } else if (v) {
      this.userData.helper = new AxesHelper(100);
      this.add(this.userData.helper);
    }
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
        // track.values[0] = e[axis];
        track.values[0] += (e[axis] - track.values[0]) * chain.influence;
        // isNaN(track.values[0]) && console.error("FUCK!", track.name);
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
            [0],
            [0]
          ),
          new NumberKeyframeTrack(
            Animation.path(name, "rotation[y]"),
            [0],
            [0]
          ),
          new NumberKeyframeTrack(Animation.path(name, "rotation[z]"), [0], [0])
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
      animation.actions({ [key]: {} });
    });
  }
  set debug(value) {
    if (this._debugSkeletonAxesHelpers) {
      this._debugSkeletonAxesHelpers.forEach(h => (h.visible = value));
    } else {
      if (value) {
        this._debugSkeletonAxesHelpers = [];
        this.mesh.skeleton.bones.forEach(b => {
          const h = new AxesHelper(100);
          this._debugSkeletonAxesHelpers.push(h);
          b.add(h);
        });
      }
    }
  }
}
