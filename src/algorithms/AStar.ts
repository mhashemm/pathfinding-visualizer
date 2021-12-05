import { Pathfinder } from "./Pathfinder";
import { Node, Position } from "./Node";
import { MinPQ } from "./MinPQ";

export class AStar extends Pathfinder {
	private pq: MinPQ;
	private dest: Position;

	constructor(G: Node[][], start: Position, dest: Position) {
		super(G, start);
		this.pq = new MinPQ(G.length * G[0].length, (x) => x.fScore);
		this.dest = dest;
		this.directions = [
			[-1, -1, 14],
			[-1, 0, 10],
			[-1, 1, 14],
			[0, 1, 10],
			[1, 1, 14],
			[1, 0, 10],
			[1, -1, 14],
			[0, -1, 10],
		];
		const [r, c] = start;
		this.G[r][c].gScore = 0;
		this.G[r][c].setHScore(this.dest);
		this.marked[r][c] = true;
		this.pq.insert(this.G[r][c]);

		while (!this.pq.isEmpty()) {
			const node = this.pq.delMin()!;
			for (const [dr, dc, cost] of this.directions) {
				const [nr, nc] = [node.row + dr, node.col + dc];
				if (this.isNodeValid(nr, nc)) this.relax(node, [nr, nc], cost);
			}
		}
	}
	private relax(from: Node, to: Position, cost: number) {
		const [tr, tc] = to;
		if (!this.isNodeValid(tr, tc)) return;
		this.edgeTo[tr][tc] = [from.row, from.col];
		this.marked[tr][tc] = true;
		this.G[tr][tc].gScore = from.gScore + cost;
		this.G[tr][tc].setHScore(this.dest);
		this.pq.insert(this.G[tr][tc]);
		this.steps.push([tr, tc]);
	}
}
