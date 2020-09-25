import { INode } from '../components/Node';

enum Orientations {
  HORIZONTAL,
  VERTICAL,
}

export class Maze {
  private G: INode[][];
  private rows: number;
  private cols: number;
  private start: [number, number];
  private finish: [number, number];

  constructor(G: INode[][], start: [number, number], finish: [number, number]) {
    this.G = G.map((row) =>
      row.map((node) => ({
        ...node,
        isWall: false,
      }))
    );
    this.rows = this.G.length;
    this.cols = this.G[0].length;
    this.start = start;
    this.finish = finish;
  }

  private rand(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private evenRand(min: number, max: number) {
    return Math.floor(this.rand(min, max) / 2) * 2;
  }

  public perfectMaze() {
    for (let i = 0; i < this.rows; i++) {
      this.G[i][0].isWall = true;
      this.G[i][this.cols - 1].isWall = true;
    }
    for (let i = 0; i < this.cols; i++) {
      this.G[0][i].isWall = true;
      this.G[this.rows - 1][i].isWall = true;
    }
    this.divide(
      this.orientation(this.cols, this.rows),
      1,
      this.cols - 2,
      1,
      this.rows - 2
    );
  }

  private divide(
    orientation: Orientations,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) {
    const horizontal = orientation === Orientations.HORIZONTAL;
    if (horizontal) {
      if (maxX - minX < 2) return;
      const y = this.evenRand(minY + 1, maxY - 1);
      this.addHWall(minX, maxX, y);
      this.divide(Orientations.VERTICAL, minX, maxX, minY, y - 1);
      this.divide(Orientations.VERTICAL, minX, maxX, y + 1, maxY);
    } else {
      if (maxY - minY < 2) return;
      const x = this.evenRand(minX + 1, maxX - 1);
      this.addVWall(minY, maxY, x);
      this.divide(Orientations.HORIZONTAL, minX, x - 1, minY, maxY);
      this.divide(Orientations.HORIZONTAL, x + 1, maxX, minY, maxY);
    }
  }

  private orientation(width: number, height: number) {
    return width < height
      ? Orientations.HORIZONTAL
      : height < width
      ? Orientations.VERTICAL
      : this.rand(0, 1) === 0
      ? Orientations.HORIZONTAL
      : Orientations.VERTICAL;
  }

  private addHWall(minX: number, maxX: number, y: number) {
    const hole = this.evenRand(minX + 1, maxX - 1) + 1;
    for (let i = minX; i <= maxX; i++) {
      if (i === hole) {
        this.G[y][i].isWall = false;
      } else {
        this.G[y][i].isWall = true;
      }
    }
  }

  private addVWall(minY: number, maxY: number, x: number) {
    const hole = this.evenRand(minY + 1, maxY - 1) + 1;
    for (let i = minY; i <= maxY; i++) {
      if (i === hole) {
        this.G[i][x].isWall = false;
      } else {
        this.G[i][x].isWall = true;
      }
    }
  }

  public randomMaze() {
    this.G.forEach((row) => {
      row.forEach((node) => {
        const r = this.rand(0, 2);
        if (r === 0) {
          node.isWall = true;
        } else {
          node.isWall = false;
        }
      });
    });
  }

  private removeWallsAround(row: number, col: number) {
    this.G[row][col].isWall = false;
    this.G[row - 1][col].isWall = false;
    this.G[row][col + 1].isWall = false;
    this.G[row + 1][col].isWall = false;
    this.G[row][col - 1].isWall = false;
    this.G[row - 1][col - 1].isWall = false;
    this.G[row + 1][col + 1].isWall = false;
    this.G[row - 1][col + 1].isWall = false;
    this.G[row + 1][col - 1].isWall = false;
  }

  public getMaze() {
    const [sr, sc] = this.start;
    const [fr, fc] = this.finish;
    this.removeWallsAround(sr, sc);
    this.removeWallsAround(fr, fc);
    return this.G;
  }
}
