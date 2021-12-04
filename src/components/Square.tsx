import { FC } from "react";
import "./Square.css";
import { Node, NodeType, Position } from "../algorithms/Node";

export interface SquareProps {
	start: Position;
	dest: Position;
	node: Node;
	onMouseEnter: () => void;
	onMouseDown: () => void;
}

export const Square: FC<SquareProps> = ({ node, start, dest, ...props }) => {
	const classes = ["node"];

	if (node.type === NodeType.Wall) {
		classes.push("wall");
	} else if (node.type === NodeType.Weight) {
		classes.push("weight");
	} else if (node.row === start[0] && node.col === start[1]) {
		classes.push("start");
	} else if (node.row === dest[0] && node.col === dest[1]) {
		classes.push("finish");
	}

	return <div {...props} className={classes.join(" ")}></div>;
};
