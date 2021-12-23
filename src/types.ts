import { type } from "os";

export type GridNodeFunc = (this: GridNodeInterface, i: number, j: number,) => GridNodeInterface;

export type GridNodeInterface = {
    x: number,
    y: number,
    isStartNode: boolean,
    isEndNode: boolean,
    isWallNode: boolean,
    g: number,
    f: number,
    h: number,
    borderNodes: GridNodeInterface[],
    previous?: GridNodeInterface
    addBorderNodes(grid: any): any
};

export interface GridState {
    grid: number[][],
}

export type GridConst = {
    new(i: number, j: number): GridNodeInterface;
}
