import { Pathfinder } from "./Pathfinder";
import { Node, Position } from "./Node";
import { MinPQ } from "./MinPQ";

const comparator = (x: Node, y: Node) => {
	return x.fScore > y.fScore ? 1 : x.fScore < y.fScore ? -1 : 0;
};

export class AStar extends Pathfinder {
	private pq: MinPQ<Node>;
	private dest: Position;

	constructor(G: Node[][], s: Position, dest: Position) {
		super(G, s);
		this.pq = new MinPQ(G.length * G[0].length, comparator);
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

		this.G[s[0]][s[1]].gScore = 0;
		this.G[s[0]][s[1]].setHScore(this.dest);
		this.pq.insert(this.G[s[0]][s[1]]);

		while (!this.pq.isEmpty()) {
			const node = this.pq.delMin()!;
			for (const [dr, dc, cost] of this.directions) {
				this.relax(node, [node.row + dr, node.col + dc], cost);
			}
		}
	}
	private relax(from: Node, to: Position, cost: number) {
		const [fr, fc] = [from.row, from.col];
		const [tr, tc] = to;
		if (!this.isNodeValid(tr, tc)) return;
		this.edgeTo[tr][tc] = [fr, fc];
		this.marked[tr][tc] = true;
		this.G[tr][tc].gScore = from.gScore + cost;
		this.G[tr][tc].setHScore(this.dest);
		this.pq.insert(this.G[tr][tc]);
		this.steps.push([tr, tc]);
	}
}
