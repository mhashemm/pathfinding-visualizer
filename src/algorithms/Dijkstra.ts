import { Pathfinder } from "./Pathfinder";
import { MinPQ } from "./MinPQ";
import { Node, Position } from "./Node";

const comparator = (x: Node, y: Node) => {
	return x.distance > y.distance ? 1 : x.distance < y.distance ? -1 : 0;
};

export class Dijkstra extends Pathfinder {
	private pq: MinPQ<Node>;

	constructor(G: Node[][], s: Position) {
		super(G, s);
		this.pq = new MinPQ(G.length * G[0].length, comparator);
		const [r, c] = s;
		this.G[r][c].distance = 0;
		this.marked[r][c] = true;
		this.pq.insert(this.G[r][c]);

		while (!this.pq.isEmpty()) {
			const { row, col } = this.pq.delMin()!;
			for (const [dr, dc] of this.directions) {
				this.relax([row, col], [row + dr, col + dc]);
			}
		}
	}

	private relax(from: Position, to: Position) {
		const [fr, fc] = from;
		const [tr, tc] = to;
		if (!this.isNodeValid(tr, tc)) return;
		this.G[tr][tc].distance = this.G[fr][fc].distance + this.G[tr][tc].weight;
		this.edgeTo[tr][tc] = [fr, fc];
		this.marked[tr][tc] = true;
		this.pq.insert(this.G[tr][tc]);
		this.steps.push([tr, tc]);
	}
}
