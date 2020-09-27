import React, { FC } from 'react';
import './Node.css';

export interface INode {
  row: number;
  col: number;
  isWall: boolean;
  isWeight: boolean;
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
  isWall,
  isWeight,
  isStart,
  isFinish,
  distance,
  ...props
}) => {
  const classes = ['node'];

  if (isWall) {
    classes.push('wall');
  } else if (isWeight) {
    classes.push('weight');
  } else if (isStart) {
    classes.push('start');
  } else if (isFinish) {
    classes.push('finish');
  }

  return <div {...props} className={classes.join(' ')}></div>;
};
