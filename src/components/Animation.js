import { AnimationMixer, AnimationClip, NumberKeyframeTrack } from "three";
import { Clips, Actions } from "./AnimationData.js";

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
    this.mesh.animations = this.clips(Clips);
    this.mixer = new AnimationMixer(mesh);
    this.actions(Actions);
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
    return keys.map(
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
    );
  }
  path(boneIndex, property) {
    const name = this.mesh.skeleton.bones[boneIndex].name;
    return Animation.path(name, property);
  }
  actions(input) {
    this.actions = {};
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
