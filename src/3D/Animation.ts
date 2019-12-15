import { AnimationMixer, AnimationClip, NumberKeyframeTrack } from "three";
import BoneID from "./BoneID";

export class Animation {
  static path = (name, property) => `${name}.${property}`;
  static parsePath = str => {
    const arr = str.split(".");
    const object = arr[0];
    const arr2 = arr[1].split("[");
    const property = arr2[0];
    const axis = arr2[1].substr(0, 1);
    return { object, property, axis };
  };
  mesh;
  mixer;
  actions;
  constructor(mesh) {
    this.mesh = mesh;
    this.mesh.animations = [];
    this.mixer = new AnimationMixer(mesh);
    this.createResetClip();
  }
  path(boneIndex, property) {
    const name = this.mesh.skeleton.bones[boneIndex].name;
    return Animation.path(name, property);
  }
  update(dt) {
    this.mixer.update(dt);
  }
  excludeBones(boneID) {
    const {
      Tail_3,
      JawU_1,
      JawL_1,
      EarL_1,
      EarR_1,
      ArmL_3,
      ArmR_3,
      LegL_4,
      LegR_4
    } = BoneID;
    return (
      [
        Tail_3,
        JawU_1,
        JawL_1,
        EarL_1,
        EarR_1,
        ArmL_3,
        ArmR_3,
        LegL_4,
        LegR_4
      ].indexOf(boneID) === -1
    );
  }
  createResetClip({
    clipName = "reset",
    initialWeight = 0,
    paused = true
  } = {}) {
    const clip = new AnimationClip(
      clipName,
      1,
      this.mesh.skeleton.bones
        .filter(this.excludeBones)
        .reduce((tracks, bone) => {
          const xyz = ["x", "y", "z"];
          xyz.forEach(axis => {
            const ts = [0];
            const rname = `${bone.name}.rotation[${axis}]`;
            const rs = new Array(1).fill(bone.rotation[axis]);
            const rtrack = new NumberKeyframeTrack(rname, ts, rs);
            const pname = `${bone.name}.position[${axis}]`;
            const ps = new Array(1).fill(bone.position[axis]);
            const ptrack = new NumberKeyframeTrack(pname, ts, ps);
            const sname = `${bone.name}.scale[${axis}]`;
            const ss = new Array(1).fill(bone.scale[axis]);
            const strack = new NumberKeyframeTrack(sname, ts, ss);
            tracks.push(rtrack);
            tracks.push(ptrack);
            tracks.push(strack);
          });
          return tracks;
        }, [])
    );
    this.mesh.animations.push(clip);
    this.makeActions({
      [clipName]: {
        weight: initialWeight,
        paused: paused,
        zeroSlopeAtEnd: false,
        zeroSlopeAtStart: false
      }
    });
    return {
      clip,
      action: this.actions[clipName]
    };
  }
  makeClips(input) {
    const keys = Object.keys(input);
    const durations = keys.map(key => {
      const tracks = input[key];
      let max = -Infinity;
      tracks.forEach(track => {
        max = Math.max(max, track.times[track.times.length - 1]);
      });
      return max;
    });
    this.mesh.animations = this.mesh.animations.concat(
      keys.map(
        (key, i) =>
          new AnimationClip(
            key,
            durations[i],
            input[key].map(
              obj =>
                new NumberKeyframeTrack(
                  this.path(obj.bone, obj.property),
                  obj.times,
                  obj.values,
                  obj.interpolation
                )
            )
          )
      )
    );
  }
  makeActions(input) {
    this.actions = this.actions || {};
    Object.keys(input).forEach(key => {
      const action = this.mixer.clipAction(key);
      const properties = Object.keys(input[key]);
      properties.forEach(prop => (action[prop] = input[key][prop]));
      action.play();
      this.actions[key] = action;
    });
  }
}
