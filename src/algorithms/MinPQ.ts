import { Node } from "./Node";

export class MinPQ {
	private pq: [key: number, value: Node][];
	private n: number;
	private key: (x: Node) => number;

	constructor(capacity: number, key: (x: Node) => number) {
		this.pq = new Array(capacity + 1);
		this.n = 0;
		this.key = key;
	}

	public insert(x: Node) {
		this.pq[++this.n] = [this.key(x), x];
		this.swim(this.n);
	}

	public delMin() {
		if (this.isEmpty()) return;
		const min = this.pq[1][1];
		this.exch(1, this.n--);
		this.sink(1);
		this.pq[this.n + 1] = null!;
		return min;
	}

	private swim(k: number) {
		while (k > 1 && this.greater(Math.floor(k / 2), k)) {
			this.exch(k, Math.floor(k / 2));
			k = Math.floor(k / 2);
		}
	}

	private sink(k: number) {
		while (2 * k <= this.n) {
			let j = 2 * k;
			if (j < this.n && this.greater(j, j + 1)) j++;
			if (!this.greater(k, j)) break;
			this.exch(k, j);
			k = j;
		}
	}

	public isEmpty() {
		return this.n === 0;
	}

	private greater(i: number, j: number) {
		return this.pq[i][0] > this.pq[j][0];
	}

	private exch(i: number, j: number) {
		const swap = this.pq[i];
		this.pq[i] = this.pq[j];
		this.pq[j] = swap;
	}
}
