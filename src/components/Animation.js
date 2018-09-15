import { AnimationMixer, AnimationClip, NumberKeyframeTrack } from "three";
import { TweenMax } from "gsap";
import { Clips, Actions } from "./AnimationData.js";

export class Animation {
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
		return `${name}.${property}`;
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
	update(dt = 1 / 60) {
		this.mixer.update(dt);
	}
	// tween(target, duration, vars) {
	// 	// TweenMax.to(action[target], duration, vars);
	// }
}
