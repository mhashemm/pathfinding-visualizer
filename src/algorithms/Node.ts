export const enum NodeType {
	Empty,
	Wall,
	Weight,
}

export type Position = [row: number, col: number];

export class Node {
	public gScore: number;
	private _hScore: number;
	private _weight: number;
	constructor(readonly row: number, readonly col: number, readonly type: NodeType = NodeType.Empty) {
		this.gScore = -1;
		this._hScore = -1;
		this._weight = type === NodeType.Weight ? (Math.random() * 100) | 0 : 1;
	}

	get weight() {
		return this._weight;
	}

	public setHScore(dest: Position) {
		const dx = Math.abs(this.col - dest[1]);
		const dy = Math.abs(this.row - dest[0]);
		this._hScore = 14 * Math.min(dx, dy) + 10 * Math.abs(dx - dy);
	}

	get fScore() {
		return this.gScore + this._hScore + this._weight;
	}
}
