import { INode } from '../components/Node';

export abstract class Pathfinder {
  protected edgeTo: [number, number][][];
  protected s: [number, number];
  protected steps: [number, number][];
  protected G: INode[][];

  constructor(G: INode[][], s: [number, number]) {
    this.G = G.map((row) => row.map((node) => ({ ...node })));
    this.s = s;

    this.edgeTo = [];

    for (let r = 0; r < G.length; r++) {
      const newRow: [number, number][] = [];
      for (let c = 0; c < G[r].length; c++) {
        newRow.push([0, 0]);
      }
      this.edgeTo.push(newRow);
    }

    this.steps = [this.s];
  }

  protected diagonalWalls(row: number, col: number): boolean {
    if (this.isOutOfRange(row, col)) return false;

    if (this.G[row][col].isWall) {
      if (this.G[row - 1][col - 1].isWall && this.G[row + 1][col + 1]) {
        return true;
      }
      if (this.G[row - 1][col + 1] && this.G[row + 1][col - 1]) {
        return true;
      }
    }

    return false;
  }

  protected isOutOfRange(row: number, col: number) {
    return (
      row < 0 || col < 0 || row >= this.G.length || col >= this.G[0].length
    );

    // return (
    //   row - 1 < 0 ||
    //   col - 1 < 0 ||
    //   row + 2 > this.G.length ||
    //   col + 2 > this.G[0].length
    // );
  }

  protected isNodeValid(row: number, col: number) {
    return !(
      this.isOutOfRange(row, col) ||
      this.G[row][col].isWall ||
      this.G[row][col].isVisited
    );
  }

  protected hasPathTo(row: number, col: number) {
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
