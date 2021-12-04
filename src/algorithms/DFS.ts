import { Node, Position } from "./Node";
import { Pathfinder } from "./Pathfinder";

export class DFS extends Pathfinder {
	constructor(G: Node[][], s: Position) {
		super(G, s);
		this.dfs([s[0], s[1]], s[0], s[1]);
	}

	private dfs(from: Position, row: number, col: number) {
		if (!this.isNodeValid(row, col)) return;

		this.marked[row][col] = true;
		this.steps.push([row, col]);
		this.edgeTo[row][col] = from;
		for (const [dr, dc] of this.directions) {
			this.dfs([row, col], row + dr, col + dc);
		}
	}
}
