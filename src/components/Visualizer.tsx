import React, { FC, useState, useRef } from 'react';
import './Visualizer.css';
import { Node, INode } from './Node';
import { DFS } from '../algorithms/DFS';
import { BFS } from '../algorithms/BFS';
import { sleep } from '../sleep';

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
        isStart: false,
        isFinish: false,
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
  const gridRef = useRef<HTMLDivElement>(null);

  const toggleWall = (node: INode) => {
    if (node.isFinish || node.isStart || isGo) return;
    setGrid((prev) => {
      const newGrid = [...prev];
      const { row, col, isWall } = { ...node };

      newGrid[row][col] = {
        ...node,
        isWall: !isWall,
      };

      return newGrid;
    });
  };

  const resetPath = () => {
    const rows = gridRef.current!.children;
    for (let r = 0; r < rows.length; r++) {
      const cols = rows[r].children as any;
      for (let c = 0; c < cols.length; c++) {
        cols[c].style = '';
      }
    }
  };

  const resetAll = () => {
    setGrid(gridInit());
    resetPath();
  };

  const goDFSgo = async () => {
    setIsGo(true);
    const dfs = new DFS(grid, START);
    const steps = dfs.getSteps();
    const path = dfs.pathTo(FINISH[0], FINISH[1]);
    const rows = gridRef.current!.children;
    for (let i = 0; i < steps.length; i++) {
      const [row, col] = steps[i];
      if (row === FINISH[0] && col === FINISH[1]) break;

      const cols = rows[row].children as any;
      cols[col].style.backgroundColor = 'red';
      await sleep(1);
    }
    if (path) {
      for (let i = 0; i < path.length; i++) {
        const [row, col] = path[i];
        const cols = rows[row].children as any;
        cols[col].style.backgroundColor = 'green';
        await sleep(1);
      }
    }
    setIsGo(false);
  };

  const goBFSgo = async () => {
    setIsGo(true);
    const bfs = new BFS(grid, START);
    // const steps = bfs.getSteps();
    // const path = bfs.pathTo(FINISH[0], FINISH[1]);
    // const rows = gridRef.current!.children;

    setIsGo(false);
  };

  return (
    <>
      <div
        className="grid"
        ref={gridRef}
        onMouseDown={() => setMouse(true)}
        onMouseUp={() => setMouse(false)}
      >
        {grid.map((row, i) => (
          <div className="row" key={i}>
            {row.map((node, j) => (
              <Node
                key={j}
                {...node}
                onMouseEnter={() => (mouse ? toggleWall(node) : null)}
                onClick={() => toggleWall(node)}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={resetAll} disabled={isGo}>
          RESET ALL
        </button>
        <button onClick={resetPath} disabled={isGo}>
          RESET PATH
        </button>
        <button onClick={goDFSgo} disabled={isGo}>
          DFS
        </button>
        <button onClick={goBFSgo} disabled={isGo}>
          BFS
        </button>
      </div>
    </>
  );
};
