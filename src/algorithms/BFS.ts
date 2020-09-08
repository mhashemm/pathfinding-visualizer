import { INode } from '../components/Node';
import { Pathfinder } from './Pathfinder';

export class BFS extends Pathfinder {
  constructor(G: INode[][], s: [number, number]) {
    super(G, s);
    this.bfs(s[0], s[1]);
  }

  private bfs(row: number, col: number) {
    const q: [number, number][] = [[row, col]];

    this.G[row][col].distance = 0;

    while (q.length > 0) {
      const [r, c] = q.shift()!;
      if (!this.isNodeValid(r, c)) continue;

      this.steps.push([r, c]);
      this.G[r][c].isVisited = true;

      if (this.isNodeValid(r - 1, c)) {
        this.edgeTo[r - 1][c] = [r, c];
        this.G[r - 1][c].distance = this.G[r][c].distance + 1;
        q.push([r - 1, c]);
      }
      if (this.isNodeValid(r, c + 1)) {
        this.edgeTo[r][c + 1] = [r, c];
        this.G[r][c + 1].distance = this.G[r][c].distance + 1;
        q.push([r, c + 1]);
      }
      if (this.isNodeValid(r + 1, c)) {
        this.edgeTo[r + 1][c] = [r, c];
        this.G[r + 1][c].distance = this.G[r][c].distance + 1;
        q.push([r + 1, c]);
      }
      if (this.isNodeValid(r, c - 1)) {
        this.edgeTo[r][c - 1] = [r, c];
        this.G[r][c - 1].distance = this.G[r][c].distance + 1;
        q.push([r, c - 1]);
      }
    }
  }

  public getDistTo(row: number, col: number) {
    return this.G[row][col].distance;
  }

  public pathTo(row: number, col: number) {
    if (!this.hasPathTo(row, col)) return null;
    const path: [number, number][] = [];

    let x: [number, number] = [row, col];

    while (this.G[x[0]][x[1]].distance !== 0) {
      path.push(x);
      x = this.edgeTo[x[0]][x[1]];
    }
    path.push(x);

    return path;
  }
}
