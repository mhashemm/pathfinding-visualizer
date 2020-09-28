import React, { FC, useState, useRef, useEffect } from 'react';
import './Visualizer.css';
import { Node, INode } from './Node';
import { Pathfinder } from '../algorithms/Pathfinder';
import { DFS } from '../algorithms/DFS';
import { BFS } from '../algorithms/BFS';
import { sleep } from '../sleep';
import { Maze } from '../algorithms/Maze';
import { Dijkstra } from '../algorithms/Dijkstra';

export interface VisualizerProps {}

const drawColor = 'rgba(17, 104, 217,0.3)';
const pathColor = 'rgb(255, 254, 106)';
const width = window.innerWidth;
const height = window.innerHeight;
const s = 26;
const speed = 1;
let [startRow, startCol] = [Math.floor(height / s / 2), 2];
let [finishRow, finishCol] = [
  Math.floor(height / s / 2),
  Math.floor(width / s) - 2,
];

const gridInit = () => {
  const grid: INode[][] = [];

  for (let row = 0; row < height / s; row++) {
    const newRow = [];
    for (let col = 0; col < width / s; col++) {
      newRow.push({
        row,
        col,
        isWall: false,
        isWeight: false,
        isStart: false,
        isFinish: false,
        distance: Infinity,
      });
    }
    grid.push(newRow);
  }

  grid[startRow][startCol].isStart = true;
  grid[finishRow][finishCol].isFinish = true;

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
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  const toggleNodeState = (node: INode) => {
    if (isGo || node.isStart || node.isFinish) return;
    setGrid((prev) => {
      const newGrid = [...prev];
      const { row, col, isWall, isWeight } = { ...node };

      if (key === null && !isWeight) {
        newGrid[row][col] = {
          ...node,
          isWall: !isWall,
        };
      } else if (key === 'KeyW' && !isWall) {
        newGrid[row][col] = {
          ...node,
          isWeight: !isWeight,
        };
      } else if (key === 'KeyS' && !(isWall || isWeight)) {
        newGrid[startRow][startCol].isStart = false;
        [startRow, startCol] = [row, col];
        newGrid[startRow][startCol].isStart = true;
      } else if (key === 'KeyF' && !(isWall || isWeight)) {
        newGrid[finishRow][finishCol].isFinish = false;
        [finishRow, finishCol] = [row, col];
        newGrid[finishRow][finishCol].isFinish = true;
      }

      return newGrid;
    });
  };

  const resetPath = () => {
    const rows = gridRef.current!.children;
    for (let r = 0; r < rows.length; r++) {
      const cols = rows.item(r)!.children;
      for (let c = 0; c < cols.length; c++) {
        (cols.item(c) as HTMLDivElement).style.backgroundColor = '';
      }
    }
  };

  const resetAll = () => {
    [startRow, startCol] = [Math.floor(height / s / 2), 2];
    [finishRow, finishCol] = [
      Math.floor(height / s / 2),
      Math.floor(width / s) - 2,
    ];
    setGrid(gridInit());
    resetPath();
  };

  const drawSearch = async (steps: [number, number][]) => {
    const rows = gridRef.current!.children;
    for (let i = 0; i < steps.length; i++) {
      const [row, col] = steps[i];
      const cols = rows.item(row)!.children;
      (cols.item(col) as HTMLDivElement).style.backgroundColor = drawColor;
      if (row === finishRow && col === finishCol) break;
      await sleep(speed);
    }
  };

  const drawPath = async (path: [number, number][] | null) => {
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
    await drawPath(pathfinder.pathTo(finishRow, finishCol));
    setIsGo(false);
  };

  const openMouse = () => setMouse(true);
  const closeMouse = () => setMouse(false);

  const maze = async (type: 'random' | 'perfect') => {
    resetPath();
    const _maze = new Maze(grid, [startRow, startCol], [finishRow, finishCol]);
    if (type === 'random') _maze.randomMaze();
    else if (type === 'perfect') _maze.perfectMaze();
    setGrid(_maze.getMaze());
  };

  return (
    <>
      <div
        className="grid"
        ref={gridRef}
        onMouseDown={openMouse}
        onMouseUp={closeMouse}
        onMouseLeave={closeMouse}
      >
        {grid.map((row, i) => (
          <div className="row" key={i}>
            {row.map((node, j) => (
              <Node
                key={j}
                {...node}
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
        <button onClick={() => maze('random')} disabled={isGo}>
          Random Maze
        </button>
        <button onClick={() => maze('perfect')} disabled={isGo}>
          Perfect Maze
        </button>
        <button
          onClick={() => visualize(new DFS(grid, [startRow, startCol]))}
          disabled={isGo}
        >
          DFS
        </button>
        <button
          onClick={() => visualize(new BFS(grid, [startRow, startCol]))}
          disabled={isGo}
        >
          BFS
        </button>
        <button
          onClick={() => visualize(new Dijkstra(grid, [startRow, startCol]))}
          disabled={isGo}
        >
          Dijkstra
        </button>
      </div>
      <p>
        Click on the grid to add a wall. Click while pressing W to add a weight,
        S to the change start node and F to the change finish node.
      </p>
    </>
  );
};
