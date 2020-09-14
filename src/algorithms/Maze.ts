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
        // isWall: !(node.isStart || node.isFinish),
        isWall: false,
      }))
    );
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

  private getNeighbors(row: number, col: number) {
    const neighbors: INeighbors = { length: 0 };

    if (this.isNodeValid(row - 2, col)) {
      neighbors.top = [row - 2, col];
      neighbors.length++;
    }
    if (this.isNodeValid(row, col + 2)) {
      neighbors.right = [row, col + 2];
      neighbors.length++;
    }
    if (this.isNodeValid(row + 2, col)) {
      neighbors.bottom = [row + 2, col];
      neighbors.length++;
    }
    if (this.isNodeValid(row, col - 2)) {
      neighbors.left = [row, col - 2];
      neighbors.length++;
    }

    return neighbors;
  }

  public perfectMaze(row: number, col: number) {
    this.G[row][col].isVisited = true;
    while (
      this.isNodeValid(row - 2, col) ||
      this.isNodeValid(row, col + 2) ||
      this.isNodeValid(row + 2, col) ||
      this.isNodeValid(row, col - 2)
    ) {
      while (true) {
        const r = this.rand(4);
        if (r === 0 && this.isNodeValid(row - 2, col)) {
          this.G[row - 1][col].isWall = true;
          this.perfectMaze(row - 2, col);
          break;
        } else if (r === 1 && this.isNodeValid(row, col + 2)) {
          this.G[row][col + 1].isWall = true;
          this.perfectMaze(row, col + 2);
          break;
        } else if (r === 2 && this.isNodeValid(row + 2, col)) {
          this.G[row + 1][col].isWall = true;
          this.perfectMaze(row + 2, col);
          break;
        } else if (r === 3 && this.isNodeValid(row, col - 2)) {
          this.G[row][col - 1].isWall = true;
          this.perfectMaze(row, col - 2);
          break;
        }
      }
    }
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
        } else {
          node.isWall = false;
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
