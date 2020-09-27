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
    const [r, c] = s;
    this.G[r][c].distance = 0;
    this.marked[r][c] = true;
    this.pq.insert(this.G[r][c]);

    while (!this.pq.isEmpty()) {
      const { row, col } = this.pq.delMin()!;
      this.relax([row, col], [row - 1, col]);
      this.relax([row, col], [row, col + 1]);
      this.relax([row, col], [row + 1, col]);
      this.relax([row, col], [row, col - 1]);
    }
  }

  private relax(from: [number, number], to: [number, number]) {
    const [fr, fc] = from;
    const [tr, tc] = to;
    if (!this.isNodeValid(tr, tc)) return;
    if (this.G[tr][tc].isWeight) {
      this.G[tr][tc].distance = this.G[fr][fc].distance + this.weight;
      this.weight++;
    } else {
      this.G[tr][tc].distance = this.G[fr][fc].distance + 1;
    }
    this.edgeTo[tr][tc] = [fr, fc];
    this.marked[tr][tc] = true;
    this.pq.insert(this.G[tr][tc]);
    this.steps.push([tr, tc]);
  }
}
