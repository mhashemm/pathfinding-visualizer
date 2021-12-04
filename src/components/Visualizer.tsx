import { FC, useState, useRef, useEffect } from "react";
import "./Visualizer.css";
import { Square } from "./Square";
import { Pathfinder } from "../algorithms/Pathfinder";
import { DFS } from "../algorithms/DFS";
import { BFS } from "../algorithms/BFS";
import { sleep } from "../sleep";
import { Maze } from "../algorithms/Maze";
import { Dijkstra } from "../algorithms/Dijkstra";
import { Node, NodeType, Position } from "../algorithms/Node";
import { AStar } from "../algorithms/AStar";

export interface VisualizerProps {}

const drawColor = "rgba(17, 104, 217,0.3)";
const pathColor = "rgb(255, 254, 106)";
const width = window.innerWidth;
const height = window.innerHeight;
const squareSize = 26;
const speed = 1;
let start: Position = [Math.floor(height / squareSize / 2), 2];
let dest: Position = [Math.floor(height / squareSize / 2), Math.floor(width / squareSize) - 2];

const gridInit = () => {
	const grid: Node[][] = [];

	for (let row = 0; row < height / squareSize; row++) {
		const newRow = [];
		for (let col = 0; col < width / squareSize; col++) {
			newRow.push(new Node(row, col));
		}
		grid.push(newRow);
	}

	return grid;
};

export const Visualizer: FC<VisualizerProps> = (props) => {
	const [isGo, setIsGo] = useState(false);
	const [grid, setGrid] = useState(gridInit());
	const [mouse, setMouse] = useState(false);
	const [key, setKey] = useState<string | null>(null);
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const keyDownHandler = (e: KeyboardEvent) => setKey(e.code);
		const keyUpHandler = () => setKey(null);
		window.addEventListener("keydown", keyDownHandler);
		window.addEventListener("keyup", keyUpHandler);
		return () => {
			window.removeEventListener("keydown", keyDownHandler);
			window.removeEventListener("keyup", keyUpHandler);
		};
	}, []);

	const toggleNodeState = (node: Node) => {
		if (isGo || ((node.row === start[0] || node.row === dest[0]) && (node.col === start[1] || node.col === dest[1])))
			return;
		setGrid((prev) => {
			const newGrid = [...prev];
			const { row, col, type } = { ...node };

			if (key === null && type === NodeType.Empty) {
				newGrid[row][col] = new Node(row, col, NodeType.Wall);
			} else if (key === "KeyW" && type === NodeType.Empty) {
				newGrid[row][col] = new Node(row, col, NodeType.Weight);
			} else if (key === "KeyS" && type === NodeType.Empty) {
				start = [row, col];
			} else if (key === "KeyD" && type === NodeType.Empty) {
				dest = [row, col];
			} else {
				newGrid[row][col] = new Node(row, col);
			}

			return newGrid;
		});
	};

	const resetPath = () => {
		const rows = gridRef.current!.children;
		for (let r = 0; r < rows.length; r++) {
			const cols = rows.item(r)!.children;
			for (let c = 0; c < cols.length; c++) {
				(cols.item(c) as HTMLDivElement).style.backgroundColor = "";
			}
		}
	};

	const resetAll = () => {
		start = [Math.floor(height / squareSize / 2), 2];
		dest = [Math.floor(height / squareSize / 2), Math.floor(width / squareSize) - 2];
		setGrid(gridInit());
		resetPath();
	};

	const drawSearch = async (steps: Position[]) => {
		const rows = gridRef.current!.children;
		for (let i = 0; i < steps.length; i++) {
			const [row, col] = steps[i];
			const cols = rows.item(row)!.children;
			(cols.item(col) as HTMLDivElement).style.backgroundColor = drawColor;
			if (row === dest[0] && col === dest[1]) break;
			await sleep(speed);
		}
	};

	const drawPath = async (path: Position[] | null) => {
		if (!path) return;

		const rows = gridRef.current!.children;
		for (let i = path.length - 1; i >= 0; i--) {
			const [row, col] = path[i];
			const cols = rows.item(row)!.children;
			(cols.item(col) as HTMLDivElement).style.backgroundColor = pathColor;
			await sleep(speed * 10);
		}
	};

	const visualize = async (pathfinder: Pathfinder) => {
		setIsGo(true);
		resetPath();
		await drawSearch(pathfinder.getSteps());
		await drawPath(pathfinder.pathTo(dest[0], dest[1]));
		setIsGo(false);
	};

	const openMouse = () => setMouse(true);
	const closeMouse = () => setMouse(false);

	const maze = async (type: "random" | "perfect") => {
		resetPath();
		const _maze = new Maze(grid, start, dest);
		if (type === "random") _maze.randomMaze();
		else if (type === "perfect") _maze.perfectMaze();
		setGrid(_maze.getMaze());
	};

	return (
		<>
			<div className="grid" ref={gridRef} onMouseDown={openMouse} onMouseUp={closeMouse} onMouseLeave={closeMouse}>
				{grid.map((row, i) => (
					<div className="row" key={i}>
						{row.map((node, j) => (
							<Square
								key={j}
								node={node}
								start={start}
								dest={dest}
								onMouseEnter={() => (mouse ? toggleNodeState(node) : null)}
								onMouseDown={() => toggleNodeState(node)}
							/>
						))}
					</div>
				))}
			</div>
			<div className="buttons">
				<button onClick={resetAll} disabled={isGo}>
					Reset All
				</button>
				<button onClick={resetPath} disabled={isGo}>
					Reset Path
				</button>
				<button onClick={() => maze("random")} disabled={isGo}>
					Random Maze
				</button>
				<button onClick={() => maze("perfect")} disabled={isGo}>
					Perfect Maze
				</button>
				<button onClick={() => visualize(new DFS(grid, start))} disabled={isGo}>
					DFS
				</button>
				<button onClick={() => visualize(new BFS(grid, start))} disabled={isGo}>
					BFS
				</button>
				<button onClick={() => visualize(new Dijkstra(grid, start))} disabled={isGo}>
					Dijkstra
				</button>
				<button onClick={() => visualize(new AStar(grid, start, dest))} disabled={isGo}>
					A*
				</button>
			</div>
			<p>
				Click on the grid to add a wall. Click while pressing W to add a weight, S to change the start node and D to
				change the destination node.
			</p>
		</>
	);
};
