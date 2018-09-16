import { Object3D, AxesHelper, Bone } from "three";

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
	constructor() {}
	init({ mesh, scene, chains }) {
		this.mesh = mesh;
		this.mesh.updateMatrixWorld();
		this.chains = {};
		Object.keys(chains).forEach(key => {
			const chain = chains[key];
			const { joints, influence, constraints } = chain;
			const bones = joints.map(
				boneID => this.mesh.skeleton.bones[boneID]
			);
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
			this.chains[key].update();
		}
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
