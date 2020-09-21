import { Pathfinder } from './Pathfinder';
import { INode } from '../components/Node';
import { MinPQ } from './MinPQ';

export class Dijkstra extends Pathfinder {
  private pq: MinPQ;
  private weight: number;

  constructor(G: INode[][], s: [number, number]) {
    super(G, s);
    this.pq = new MinPQ(G.length * G[0].length);
    this.weight = 2;
    this.G[s[0]][s[1]].distance = 0;
    this.pq.insert(this.G[s[0]][s[1]]);

    while (!this.pq.isEmpty()) {
      const { row, col } = this.pq.delMin()!;
      this.G[row][col].isVisited = true;
      this.relax([row, col], [row - 1, col]);
      this.relax([row, col], [row, col + 1]);
      this.relax([row, col], [row, col - 1]);
      this.relax([row, col], [row + 1, col]);
    }
  }

  private relax(from: [number, number], to: [number, number]) {
    const [fr, fc] = from;
    const [tr, tc] = to;
    if (!this.isNodeValid(tr, tc)) return;
    if (
      this.G[fr][fr].isWeight &&
      this.G[tr][tc].distance > this.G[fr][fc].distance + this.weight
    ) {
      this.G[tr][tc].distance = this.G[fr][fc].distance + this.weight;
      this.weight++;
    } else {
      this.G[tr][tc].distance = this.G[fr][fc].distance + 1;
    }
    this.edgeTo[tr][tc] = [fr, fc];
    this.G[tr][tc].isVisited = true;
    this.pq.insert(this.G[tr][tc]);
    this.steps.push([tr, tc]);
  }
}
