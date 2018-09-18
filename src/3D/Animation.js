import { AnimationMixer, AnimationClip, NumberKeyframeTrack } from "three";

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
  constructor(mesh) {
    this.mesh = mesh;
    this.mesh.animations = [];
    this.mixer = new AnimationMixer(mesh);
    this.createResetClip();
  }
  createResetClip() {
    const clip = new AnimationClip(
      "reset",
      1,
      this.mesh.skeleton.bones.reduce((tracks, bone) => {
        const xyz = ["x", "y", "z"];
        xyz.forEach(axis => {
          const ts = [0, 1];
          const rname = `${bone.name}.rotation[${axis}]`;
          const rs = new Array(2).fill(bone.rotation[axis]);
          const rtrack = new NumberKeyframeTrack(rname, ts, rs);
          const pname = `${bone.name}.position[${axis}]`;
          const ps = new Array(2).fill(bone.position[axis]);
          const ptrack = new NumberKeyframeTrack(pname, ts, ps);
          tracks.push(rtrack);
          tracks.push(ptrack);
        });
        return tracks;
      }, [])
    );
    this.mesh.animations.push(clip);
    this.actions({
      reset: {
        weight: 0,
        paused: true,
        zeroSlopeAtEnd: false,
        zeroSlopeAtStart: false
      }
    });
  }
  clips(input) {
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
  path(boneIndex, property) {
    const name = this.mesh.skeleton.bones[boneIndex].name;
    return Animation.path(name, property);
  }
  actions(input) {
    this.actions = this.actions || {};
    Object.keys(input).forEach(key => {
      const action = this.mixer.clipAction(key);
      const properties = Object.keys(input[key]);
      properties.forEach(prop => (action[prop] = input[key][prop]));
      action.play();
      this.actions[key] = action;
    });
  }
  update(dt) {
    this.mixer.update(dt);
  }
}
