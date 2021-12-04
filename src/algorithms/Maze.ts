import { Node, NodeType, Position } from "./Node";

enum Orientations {
	HORIZONTAL,
	VERTICAL,
}

export class Maze {
	private G: Node[][];
	private rows: number;
	private cols: number;
	private start: Position;
	private dest: Position;
	private directions = [
		[0, 0],
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];

	constructor(G: Node[][], start: Position, dest: Position) {
		this.G = G.map((row, r) => row.map((_, c) => new Node(r, c)));
		this.rows = this.G.length;
		this.cols = this.G[0].length;
		this.start = start;
		this.dest = dest;
	}

	private rand(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	private evenRand(min: number, max: number) {
		return Math.floor(this.rand(min, max) / 2) * 2;
	}

	public perfectMaze() {
		for (let i = 0; i < this.rows; i++) {
			this.G[i][0] = new Node(i, 0, NodeType.Wall);
			this.G[i][this.cols - 1] = new Node(i, this.cols - 1, NodeType.Wall);
		}
		for (let i = 0; i < this.cols; i++) {
			this.G[0][i] = new Node(i, 0, NodeType.Wall);
			this.G[this.rows - 1][i] = new Node(i, this.cols - 1, NodeType.Wall);
		}
		this.divide(this.orientation(this.cols, this.rows), 1, this.cols - 2, 1, this.rows - 2);
	}

	private divide(orientation: Orientations, minX: number, maxX: number, minY: number, maxY: number) {
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
				this.G[y][i] = new Node(y, i);
			} else {
				this.G[y][i] = new Node(y, i, NodeType.Wall);
			}
		}
	}

	private addVWall(minY: number, maxY: number, x: number) {
		const hole = this.evenRand(minY + 1, maxY - 1) + 1;
		for (let i = minY; i <= maxY; i++) {
			if (i === hole) {
				this.G[i][x] = new Node(i, x);
			} else {
				this.G[i][x] = new Node(i, x, NodeType.Wall);
			}
		}
	}

	public randomMaze() {
		this.G = this.G.map((row, r) =>
			row.map((_, c) => {
				return this.rand(0, 2) === 0 ? new Node(r, c, NodeType.Wall) : new Node(r, c);
			})
		);
	}

	private isOutOfRange(row: number, col: number) {
		return row < 0 || col < 0 || row >= this.G.length || col >= this.G[0].length;
	}

	private removeWallsAround(pos: Position) {
		for (const [dr, dc] of this.directions) {
			const [nr, nc] = [pos[0] + dr, pos[1] + dc];
			if (!this.isOutOfRange(nr, nc)) {
				this.G[nr][nc] = new Node(nr, nc);
			}
		}
	}

	public getMaze() {
		this.removeWallsAround(this.start);
		this.removeWallsAround(this.dest);
		return this.G;
	}
}
