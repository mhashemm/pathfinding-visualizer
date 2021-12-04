import { Node, NodeType, Position } from "./Node";

export abstract class Pathfinder {
	protected edgeTo: Position[][];
	protected marked: boolean[][];
	protected s: Position;
	protected steps: Position[];
	protected G: Node[][];
	protected directions = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];

	constructor(G: Node[][], s: Position) {
		// this.G = G.map((row) => row.map((node) => ({ ...node })));
		this.G = G;
		this.edgeTo = G.map((row) => row.map(() => [0, 0]));
		this.marked = G.map((row) => row.map(() => false));
		this.s = s;
		this.steps = [this.s];
	}

	protected isOutOfRange(row: number, col: number) {
		return row < 0 || col < 0 || row >= this.G.length || col >= this.G[0].length;
	}

	protected isNodeValid(row: number, col: number) {
		return !(this.isOutOfRange(row, col) || this.G[row][col].type === NodeType.Wall || this.marked[row][col]);
	}

	public hasPathTo(row: number, col: number) {
		return this.marked[row][col];
	}

	public pathTo(row: number, col: number) {
		if (!this.hasPathTo(row, col)) return null;
		const path: Position[] = [];
		let x: Position = [row, col];

		while (x[0] !== this.s[0] || x[1] !== this.s[1]) {
			path.push(x);
			x = this.edgeTo[x[0]][x[1]];
		}
		path.push(this.s);
		return path;
	}

	public getSteps() {
		return this.steps;
	}
}
