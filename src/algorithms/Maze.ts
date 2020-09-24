import { INode } from '../components/Node';

export class Maze {
  private G: INode[][];
  private rows: number;
  private cols: number;

  constructor(G: INode[][]) {
    this.G = G.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
      }))
    );
    this.rows = this.G.length;
    this.cols = this.G[0].length;

    for (let i = 0; i < this.rows; i++) {
      this.G[i][0].isWall = true;
      this.G[i][this.cols - 1].isWall = true;
    }
    for (let i = 0; i < this.cols; i++) {
      this.G[0][i].isWall = true;
      this.G[this.rows - 1][i].isWall = true;
    }
  }

  private rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private isNodeStartOrFinish(row: number, col: number) {
    return this.G[row][col].isStart || this.G[row][col].isFinish;
  }

  public perfectMaze() {
    // Recursive Division
    // http://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm
    // https://hurna.io/academy/algorithms/maze_generator/recursive_division.html
    // https://gist.github.com/josiahcarlson/904686/59fed91abf758d3f125290544ed5f2ced2227a7f
    // https://stackoverflow.com/questions/23530756/maze-recursive-division-algorithm-design
    // https://github.com/armin-reichert/mazes/blob/master/mazes-algorithms/src/main/java/de/amr/maze/alg/others/RecursiveDivision.java
    this.divide(true, 1, this.cols - 2, 1, this.rows - 2);
  }

  private divide(
    h: boolean,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) {
    if (h) {
      if (maxX - minX < 2) return;
      const y = Math.floor(this.rand(minY, maxY) / 2) * 2;
      this.addHWall(minX, maxX, y);
      this.divide(!h, minX, maxX, minY, y - 1);
      this.divide(!h, minX, maxX, y + 1, maxY);
    } else {
      if (maxY - minY < 2) return;
      const x = Math.floor(this.rand(minX, maxX) / 2) * 2;
      this.addVWall(minY, maxY, x);
      this.divide(!h, minX, x - 1, minY, maxY);
      this.divide(!h, x + 1, maxX, minY, maxY);
    }
  }

  private addHWall(minX: number, maxX: number, y: number) {
    const hole = Math.floor(this.rand(minX, maxX) / 2) * 2 + 1;
    for (let i = minX; i <= maxX; i++) {
      if (i !== hole && !this.isNodeStartOrFinish(y, i)) {
        this.G[y][i].isWall = true;
      }
    }
  }

  private addVWall(minY: number, maxY: number, x: number) {
    const hole = Math.floor(this.rand(minY, maxY) / 2) * 2 + 1;
    for (let i = minY; i <= maxY; i++) {
      if (i !== hole && !this.isNodeStartOrFinish(i, x)) {
        this.G[i][x].isWall = true;
      }
    }
  }

  public randomMaze() {
    this.G.forEach((row) => {
      row.forEach((node) => {
        if (this.isNodeStartOrFinish(node.row, node.col)) {
          return;
        }
        const r = this.rand(0, 2);
        if (r === 0) {
          node.isWall = true;
        } else {
          node.isWall = false;
        }
      });
    });
  }

  public getMaze() {
    return this.G;
  }
}
