import { INode } from '../components/Node';
import { Pathfinder } from './Pathfinder';

export class DFS extends Pathfinder {
  constructor(G: INode[][], s: [number, number]) {
    super(G, s);
    this.dfs([s[0], s[1]], s[0], s[1]);
  }

  private dfs(from: [number, number], row: number, col: number) {
    if (!this.isNodeValid(row, col)) return;

    this.marked[row][col] = true;
    this.steps.push([row, col]);
    this.edgeTo[row][col] = from;

    this.dfs([row, col], row - 1, col);

    this.dfs([row, col], row, col + 1);

    this.dfs([row, col], row + 1, col);

    this.dfs([row, col], row, col - 1);
  }
}
