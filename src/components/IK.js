import { Object3D, AxesHelper, Bone } from "three";
import { IK, IKChain, IKJoint, IKBallConstraint, IKHelper } from "three-ik";

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
	constructor(mesh) {
		this.mesh = mesh;
		this.mesh.updateMatrixWorld();
		//
		this.ik = new IK();
	}
	init(scene, chains) {
		this.chains = {};
		Object.keys(chains).forEach(key => {
			const constraints = chains[key].constraints.map(angle => [
				new IKBallConstraint(angle)
			]);
			const bones = chains[key].joints.map(
				boneID => this.mesh.skeleton.bones[boneID]
			);
			const target = new IKTarget(bones[bones.length - 1]);
			this.mesh.add(target);
			let joints = bones.map(bone => new IKJoint(bone));
			const chain = new IKChain();
			// joints = joints.reverse();
			joints.forEach((j, i, arr) => {
				if (i === arr.length - 1) {
					chain.add(j, { target });
				} else {
					chain.add(j);
				}
			});
			this.chains[key] = chain;
			this.ik.add(chain);
		});
		// //
		// //
		this.helper = new IKHelper(this.ik, {
			showBones: true,
			showAxes: true,
			axesSize: 200,
			boneSize: 50
		});
		scene.add(this.helper);
	}
	update() {
		this.chains.worm.target.position.x = Math.sin(Date.now() * 0.003) * 200;
		this.chains.worm.target.position.z = -550;
		this.chains.worm.target.position.y = Math.cos(Date.now() * 0.003) * 200;
		this.chains.worm.target.rotateY(0.1);
		this.ik.solve();
	}
	set debug(value) {
		Object.keys(this.chains).forEach(
			key => (this.chains[key].target.debug = value)
		);
		// if (this._debugSkeletonAxesHelpers) {
		// 	this._debugSkeletonAxesHelpers.forEach(h => (h.visible = value));
		// } else {
		// 	if (value) {
		// 		this._debugSkeletonAxesHelpers = [];
		// 		this.mesh.skeleton.bones.forEach(b => {
		// 			const h = new AxesHelper(100);
		// 			this._debugSkeletonAxesHelpers.push(h);
		// 			b.add(h);
		// 		});
		// 	}
		// }
	}
}
