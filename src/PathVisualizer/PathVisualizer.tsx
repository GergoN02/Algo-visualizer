import { Box, Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { useEffect, useState } from 'react';
import Astar from '../Algorithms/Astar';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { GridNodeInterface, GridState } from "../types";
import Node from './Node/Node';

const cols = 50;
const rows = 35;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const VISUAL_SPEED = 10;


const PathVisualizer = () => {

    const [gridState, setGridState] = React.useState<GridState>({
        grid: []
    });
    const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
    const [tracePath, setTracePath] = useState<GridNodeInterface[]>([]);
    const [visitedNodes, setVisitedNodes] = useState<GridNodeInterface[]>([]);


    useEffect(() => {
        initGrid();
    }, []);


    const initGrid = () => {
        const tempGrid: number[][] = new Array(rows);

        for (let i = 0; i < rows; i++) {
            tempGrid[i] = new Array(cols);
        }
        createGridNode(tempGrid);
        setGridState({
            ...gridState,
            grid: tempGrid
        });
    }

    const execAstar = (grid: any) => {
        runAddBorderNodes(grid);

        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        startNode.isWallNode = false;
        endNode.isWallNode = false;

        let path = Astar(startNode, endNode);
        if (path.error) {
            console.log(path.error);
        }
        setTracePath(path.tracePath);
        setVisitedNodes(path.visitedInOrder);
    }

    const handleMouseDown = (row: number, col: number) => {
        setIsMousePressed(true);
        const newGrid = gridWithWalls(gridState.grid, row, col);
        setGridState({
            ...gridState,
            grid: newGrid
        });
    }


    const handleMouseEnter = (row: number, col: number) => {
        if (isMousePressed) {
            const newGrid = gridWithWalls(gridState.grid, row, col);
            setGridState({
                ...gridState,
                grid: newGrid,
            });
        }
        return;


    }

    const handleMouseUp = () => {
        setIsMousePressed(false)
    }

    const createGridNode = (grid: any) => {

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j] = new (gridNode as any)(i, j);
            }
        }
    }

    const gridWithWalls = (grid: any, row: number, col: number) => {
        const newGrid = grid.slice();
        const newNode = new (gridNode as any)(row, col);
        newNode.isWallNode = !newNode.isWallNode;
        newGrid[row][col] = newNode;
        return newGrid;
    }

    const runAddBorderNodes = (grid: any) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                grid[i][j].addBorderNodes(grid);
            }
        }
    }



    const gridNode = function GridNode(this: GridNodeInterface, i: number, j: number) {
        this.x = i; // reference co-ordinates for node constructor
        this.y = j;

        this.isStartNode = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEndNode = this.x === NODE_END_ROW && this.y === NODE_END_COL;
        this.isWallNode = false;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.borderNodes = [];
        this.previous = undefined;
        this.addBorderNodes = function (grid: any) {
            let i = this.x;
            let j = this.y;

            if (i > 0) this.borderNodes.push(grid[i - 1][j]);
            if (i < rows - 1) this.borderNodes.push(grid[i + 1][j]);
            if (j > 0) this.borderNodes.push(grid[i][j - 1]);
            if (j < cols - 1) this.borderNodes.push(grid[i][j + 1]);
        }
    }

    const provideGrid = (
        <div>
            {gridState.grid.map((row, rowIdx) => {
                return (
                        <Flex
                            key={rowIdx}
                        >
                            {row.map((col, colIdx) => {
                                const { isStartNode, isEndNode, isWallNode } = col as any;
                                return (
                                    <Node
                                        key={colIdx}
                                        row={rowIdx}
                                        col={colIdx}
                                        isStartNode={isStartNode}
                                        isEndNode={isEndNode}
                                        isWallNode={isWallNode}
                                        mouseIsPressed={isMousePressed}
                                        onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                        onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                        onMouseUp={() => handleMouseUp()}
                                    />
                                );
                            })}
                        </Flex>
                )

            })}
        </div>
    )

    const visualizeTrace = (shortestPathNodes: GridNodeInterface[]) => {
        for (let i = 0; i < shortestPathNodes.length; i++) {
            setTimeout(() => {
                const node = shortestPathNodes[i];
                const currentNode = document.getElementById(`node-${node.x}-${node.y}`);
                if (currentNode !== null) { currentNode.className = "node node-traced-path" }
            }, VISUAL_SPEED * i)
        }
    }

    const visualizeProcess = () => { //Button needs double click, probably state update breaks it :((

        execAstar(gridState.grid);

        for (let i = 0; i <= visitedNodes.length; i++) {
            if (i === visitedNodes.length) {
                setTimeout(() => {
                    visualizeTrace(tracePath)
                }, VISUAL_SPEED * i)
            } else {
                setTimeout(() => {
                    const node = visitedNodes[i];
                    const currentNode = document.getElementById(`node-${node.x}-${node.y}`);
                    if (currentNode !== null) { currentNode.className = "node node-visited" }
                }, VISUAL_SPEED * i)
            }
        }
    }


    return (
        <Box ml="auto" width="80%" mt={10}>
            <h1>
                <ColorModeSwitcher/>
                <Button
                    colorScheme="blue"
                    onClick={
                        () => visualizeProcess()
                    }
                    mb={4}
                >
                    Confirm
                </Button>
                Path Visualizer
                {provideGrid}
            </h1>
        </Box>
    )

}

export default PathVisualizer;

    // const GridNode = (i: number, j: number) => {
    //     const [nodeState, setNodeState] = useState<GridNode>({
    //         x: 0,
    //         y: 0,
    //         isStartNode: false,
    //         isEndNode: false,
    //         isWallNode: false,
    //         g: 0,
    //         f: 0,
    //         h: 0,
    //         borderNodes: [],
    //         previous: undefined,
    //     })

    //     setNodeState({
    //         ...nodeState,
    //         x: i,
    //         y: j,
    //         isStartNode: i === NODE_START_ROW && j === NODE_START_COL,
    //         isEndNode: i === NODE_END_ROW && j === NODE_END_COL,
    //     })

    //     const addBorderNodes = (grid: any) => {
    //         let tempBorderNodes: GridNode[] = [];

    //         if (i > 0) tempBorderNodes.push(grid[i - 1][j]);
    //         if (i < rows - 1) tempBorderNodes.push(grid[i + 1][j]);
    //         if (j > 0) tempBorderNodes.push(grid[i][j - 1]);
    //         if (j < cols - 1) tempBorderNodes.push(grid[i][j + 1]);

    //         setNodeState({
    //             ...nodeState,
    //             borderNodes: tempBorderNodes
    //         })
    //     }

    //     return GridNode;
    // }
