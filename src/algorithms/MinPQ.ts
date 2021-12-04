export class MinPQ<T> {
	private pq: T[];
	private n: number;
	private comparator: (x: T, y: T) => -1 | 0 | 1;

	constructor(capacity: number, comparator: (x: T, y: T) => -1 | 0 | 1) {
		this.pq = new Array(capacity + 1);
		this.n = 0;
		this.comparator = comparator;
	}

	public insert(x: T) {
		this.pq[++this.n] = x;
		this.swim(this.n);
	}

	public delMin() {
		if (this.isEmpty()) return;
		const min = this.pq[1];
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
		return this.comparator(this.pq[i], this.pq[j]) === 1;
	}

	private exch(i: number, j: number) {
		const swap = this.pq[i];
		this.pq[i] = this.pq[j];
		this.pq[j] = swap;
	}
}
