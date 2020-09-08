import React, { FC } from 'react';
import './Node.css';

export interface INode {
  row: number;
  col: number;
  isVisited: boolean;
  isWall: boolean;
  isStart: boolean;
  isFinish: boolean;
  distance: number;
}

export interface NodeProps extends INode {
  onMouseEnter: () => void;
  onClick: () => void;
}

export const Node: FC<NodeProps> = ({
  row,
  col,
  isVisited,
  isWall,
  isStart,
  isFinish,
  distance,
  ...props
}) => {
  return (
    <div {...props} className={['node', isWall ? 'wall' : ''].join(' ')}>
      {isStart ? '+' : isFinish ? '-' : null}
    </div>
  );
};
