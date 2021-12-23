import React from 'react';
import "./Node.css"

interface NodeInterface {
    key: number,
    row: number,
    col: number,
    isStartNode: boolean,
    isEndNode: boolean,
    isWallNode: boolean,
    mouseIsPressed: boolean,
    onMouseDown(row: number, col: number): any,
    onMouseEnter(row: number, col: number): any,
    onMouseUp(): any
}

const Node: React.FC<NodeInterface> = ({row, col, isStartNode, isEndNode, isWallNode, onMouseDown, onMouseEnter, onMouseUp}) => {

    const stateClassName = isEndNode ? 'node-end' : isStartNode ? 'node-start' : isWallNode ? "node-wall" : '';

    return (
        <div
            className={`node ${stateClassName}`}
            id={`node-${row}-${col}`}
            onMouseDown={() => onMouseDown(row, col)}
            onMouseEnter={() => onMouseEnter(row, col)}
            onMouseUp={() => onMouseUp()}
        >
        </div>
    )

}

export default Node;
