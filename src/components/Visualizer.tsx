import React, { FC, useState, useRef, useEffect } from 'react';
import './Visualizer.css';
import { Node, INode } from './Node';
import { DFS } from '../algorithms/DFS';
import { BFS } from '../algorithms/BFS';
import { sleep } from '../sleep';
import { Maze } from '../algorithms/Maze';
import { Dijkstra } from '../algorithms/Dijkstra';

export interface VisualizerProps {}

let START: [number, number];
let FINISH: [number, number];

const gridInit = (
  width: number = window.innerWidth,
  height: number = window.innerHeight
) => {
  const s = 26;
  const grid: INode[][] = [];

  for (let row = 0; row < height / s; row++) {
    const newRow = [];
    for (let col = 0; col < width / s; col++) {
      newRow.push({
        row,
        col,
        isVisited: false,
        isWall: false,
        isWeight: false,
        isStart: false,
        isFinish: false,
        distance: Infinity,
      });
    }
    grid.push(newRow);
  }

  START = [Math.floor(height / s / 2), 2];
  FINISH = [Math.floor(height / s / 2), Math.floor(width / s) - 2];

  grid[START[0]][START[1]].isStart = true;
  grid[FINISH[0]][FINISH[1]].isFinish = true;

  return grid;
};

export const Visualizer: FC<VisualizerProps> = (props) => {
  const [isGo, setIsGo] = useState(false);
  const [grid, setGrid] = useState(gridInit());
  const [mouse, setMouse] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [key, setKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => setKey(e.key.toLowerCase());
    const keyUpHandler = () => setKey(null);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  const toggleWall = (node: INode) => {
    if (node.isFinish || node.isStart || isGo) return;
    setGrid((prev) => {
      const newGrid = [...prev];
      const { row, col, isWall, isWeight } = { ...node };

      if (key === 'w' && !isWall) {
        newGrid[row][col] = {
          ...node,
          isWeight: !isWeight,
        };
      } else if (!isWeight) {
        newGrid[row][col] = {
          ...node,
          isWall: !isWall,
        };
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
    setGrid(gridInit());
    resetPath();
  };

  const drawSearch = async (steps: [number, number][]) => {
    const rows = gridRef.current!.children;
    for (let i = 0; i < steps.length; i++) {
      const [row, col] = steps[i];
      const cols = rows.item(row)!.children;
      (cols.item(col) as HTMLDivElement).style.backgroundColor =
        'rgba(17, 104, 217,0.3)';
      if (row === FINISH[0] && col === FINISH[1]) break;
      await sleep(speed);
    }
  };

  const drawPath = async (path: [number, number][] | null) => {
    if (!path) return;

    const rows = gridRef.current!.children;
    for (let i = path.length - 1; i >= 0; i--) {
      const [row, col] = path[i];
      const cols = rows.item(row)!.children;
      (cols.item(col) as HTMLDivElement).style.backgroundColor =
        'rgb(255, 254, 106)';
      await sleep(speed * 5);
    }
  };

  const visualize = async (Pathfinder: any) => {
    setIsGo(true);
    resetPath();
    const pathfinder = new Pathfinder(grid, START);
    await drawSearch(pathfinder.getSteps());
    await drawPath(pathfinder.pathTo(FINISH[0], FINISH[1]));
    setIsGo(false);
  };

  const openMouse = () => setMouse(true);
  const closeMouse = () => setMouse(false);

  const maze = (type: 'random' | 'perfect') => {
    resetAll();
    const _maze = new Maze(grid);
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
                onMouseEnter={() => (mouse ? toggleWall(node) : null)}
                onMouseDown={() => toggleWall(node)}
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
        <button onClick={() => visualize(DFS)} disabled={isGo}>
          DFS
        </button>
        <button onClick={() => visualize(BFS)} disabled={isGo}>
          BFS
        </button>
        <button onClick={() => visualize(Dijkstra)} disabled={isGo}>
          Dijkstra
        </button>
      </div>
    </>
  );
};
