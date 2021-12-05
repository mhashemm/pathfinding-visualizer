import { Pathfinder } from "./Pathfinder";
import { MinPQ } from "./MinPQ";
import { Node, Position } from "./Node";

export class Dijkstra extends Pathfinder {
	private pq: MinPQ;

	constructor(G: Node[][], start: Position) {
		super(G, start);
		this.pq = new MinPQ(G.length * G[0].length, (x) => x.gScore);
		const [r, c] = start;
		this.G[r][c].gScore = 0;
		this.marked[r][c] = true;
		this.pq.insert(this.G[r][c]);

		while (!this.pq.isEmpty()) {
			const node = this.pq.delMin()!;
			for (const [dr, dc] of this.directions) {
				const [nr, nc] = [node.row + dr, node.col + dc];
				if (this.isNodeValid(nr, nc)) this.relax(node, [nr, nc]);
			}
		}
	}

	private relax(from: Node, to: Position) {
		const [tr, tc] = to;
		if (!this.isNodeValid(tr, tc)) return;
		this.G[tr][tc].gScore = from.gScore + this.G[tr][tc].weight;
		this.edgeTo[tr][tc] = [from.row, from.col];
		this.marked[tr][tc] = true;
		this.pq.insert(this.G[tr][tc]);
		this.steps.push([tr, tc]);
	}
}
