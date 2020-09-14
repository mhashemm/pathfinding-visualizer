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
  onMouseDown: () => void;
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
  const classes = ['node'];

  if (isWall) {
    classes.push('wall');
  } else if (isStart) {
    classes.push('start');
  } else if (isFinish) {
    classes.push('finish');
  }

  return <div {...props} className={classes.join(' ')}></div>;
};
