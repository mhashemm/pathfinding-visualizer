import { INode } from '../components/Node';
import { Pathfinder } from './Pathfinder';

export class BFS extends Pathfinder {
  constructor(G: INode[][], s: [number, number]) {
    super(G, s);

    this.bfs(s[0], s[1]);
  }

  private bfs(row: number, col: number) {}
}
