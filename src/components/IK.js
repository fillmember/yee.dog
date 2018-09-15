import { AxesHelper } from "three";

export class IKSolver {
	constructor(mesh) {
		this.mesh = mesh;
		mesh.updateMatrixWorld();
	}
	chains(chains) {}
	update() {}
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
