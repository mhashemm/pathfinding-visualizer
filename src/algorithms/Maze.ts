import { INode } from '../components/Node';

interface INeighbors {
  top?: [number, number];
  right?: [number, number];
  bottom?: [number, number];
  left?: [number, number];
  length: number;
}

export class Maze {
  private G: INode[][];
  private steps: [number, number][];

  constructor(G: INode[][]) {
    this.G = G.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: node.isStart || node.isFinish,
        isWall: false,
      }))
    );
    const rows = this.G.length;
    const cols = this.G[0].length;

    for (let i = 0; i < rows; i++) {
      this.G[i][0].isWall = true;
      this.G[i][cols - 1].isWall = true;
    }
    for (let i = 0; i < cols; i++) {
      this.G[0][i].isWall = true;
      this.G[rows - 1][i].isWall = true;
    }
    this.steps = [];
  }

  private rand(max: number) {
    return Math.floor(Math.random() * max);
  }

  private isOutOfRange(row: number, col: number) {
    return (
      row < 0 || col < 0 || row >= this.G.length || col >= this.G[0].length
    );
  }

  private isNodeValid(row: number, col: number) {
    return !(this.isOutOfRange(row, col) || this.G[row][col].isVisited);
  }

  private isNodeStartOrFinish(row: number, col: number) {
    return this.G[row][col].isStart || this.G[row][col].isFinish;
  }

  public perfectMaze(start: [number, number], finish: [number, number]) {
    // Recursive Division
    // http://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm
    // https://hurna.io/academy/algorithms/maze_generator/recursive_division.html

    const [sr, sc] = start;
    const [fr, fc] = finish;
    const rows = this.G.length;
    const cols = this.G[0].length;
  }

  public randomMaze() {
    this.G.forEach((row) => {
      row.forEach((node) => {
        if (this.isNodeStartOrFinish(node.row, node.col)) {
          return;
        }
        const r = this.rand(3);
        if (r === 0) {
          node.isWall = true;
        }
      });
    });
  }

  public getMaze() {
    return this.G.map((row) =>
      row.map((node) => {
        return { ...node, isVisited: false };
      })
    );
  }
}
