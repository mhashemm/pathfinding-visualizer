import { Node, Position } from "./Node";
import { Pathfinder } from "./Pathfinder";

export class BFS extends Pathfinder {
	constructor(G: Node[][], s: Position) {
		super(G, s);
		this.bfs(s[0], s[1]);
	}

	private bfs(row: number, col: number) {
		const q: Position[] = [[row, col]];

		while (q.length > 0) {
			const [r, c] = q.shift()!;
			if (!this.isNodeValid(r, c)) continue;
			this.G[r][c].gScore = 0;
			this.steps.push([r, c]);
			this.marked[r][c] = true;

			for (const [dr, dc] of this.directions) {
				const [nr, nc] = [r + dr, c + dc];
				if (this.isNodeValid(nr, nc)) {
					this.edgeTo[nr][nc] = [r, c];
					this.G[nr][nc].gScore = this.G[r][c].gScore + 1;
					q.push([nr, nc]);
				}
			}
		}
	}
}
