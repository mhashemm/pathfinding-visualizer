import { INode } from '../components/Node';

export abstract class Pathfinder {
  protected edgeTo: [number, number][][];
  protected s: [number, number];
  protected steps: [number, number][];
  protected G: INode[][];

  constructor(G: INode[][], s: [number, number]) {
    this.G = G.map((row) => row.map((node) => ({ ...node })));
    this.s = s;
    this.edgeTo = G.map((row) => row.map(() => [0, 0]));
    this.steps = [this.s];
  }

  protected isOutOfRange(row: number, col: number) {
    return (
      row < 0 || col < 0 || row >= this.G.length || col >= this.G[0].length
    );
  }

  protected isNodeValid(row: number, col: number) {
    return !(
      this.isOutOfRange(row, col) ||
      this.G[row][col].isWall ||
      this.G[row][col].isVisited
    );
  }

  public hasPathTo(row: number, col: number) {
    return this.G[row][col].isVisited;
  }

  public pathTo(row: number, col: number) {
    if (!this.hasPathTo(row, col)) return null;
    const path: [number, number][] = [];
    let x: [number, number] = [row, col];

    while (x[0] !== this.s[0] || x[1] !== this.s[1]) {
      path.push(x);
      x = this.edgeTo[x[0]][x[1]];
    }
    path.push(this.s);
    return path;
  }

  public getSteps() {
    return this.steps;
  }
}
