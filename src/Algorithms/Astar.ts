import {GridNodeInterface} from "../types";


const Astar = (startNode: GridNodeInterface, endNode: GridNodeInterface) => {
    let nodesToVisit: GridNodeInterface[] = [];
    let nodesVisited: GridNodeInterface[] = [];
    let tracePath: GridNodeInterface[] = [];
    let visitedInOrder: GridNodeInterface[] = [];

    nodesToVisit.push(startNode);

    while (nodesToVisit.length > 0) {
        let leastIdx: number = 0;
        for (let i = 0; i < nodesToVisit.length; i++) {
            if (nodesToVisit[i].f < nodesToVisit[leastIdx].f) {
                leastIdx = i;
            }
        }

        let currentNode = nodesToVisit[leastIdx];
        visitedInOrder.push(currentNode);
        console.log(currentNode)

        if (currentNode === endNode) {
            let temp = currentNode;

            while(temp.previous) {
                tracePath.push(temp);
                temp = temp.previous;
            }
            tracePath.push(startNode);
            return { tracePath, visitedInOrder };
        }

        nodesToVisit = nodesToVisit.filter((node) => node !== currentNode);
        nodesVisited.push(currentNode);

        let borderNodes = currentNode.borderNodes;

        for (let i = 0; i < borderNodes.length; i++) {
            let currentBorderNode = borderNodes[i];

            if (!nodesVisited.includes(currentBorderNode) && !currentBorderNode.isWallNode) {
                let tempG = currentNode.g + 1;
                let newTracePath = false;
                if (nodesToVisit.includes(currentBorderNode)) {
                    if (tempG < currentBorderNode.g) {
                        currentBorderNode.g = tempG;
                        newTracePath = true;
                    }
                } else {
                    currentBorderNode.g = tempG;
                    newTracePath = true;
                    nodesToVisit.push(currentBorderNode);
                }

                if (newTracePath) {
                    currentBorderNode.h = heuristicScore(currentBorderNode, endNode);
                    currentBorderNode.f = currentBorderNode.g + currentBorderNode.h;
                    currentBorderNode.previous = currentNode;
                }

            }
        }
    }

    return { tracePath, visitedInOrder, error: "No Path Found"}
}



const heuristicScore = (a: GridNodeInterface, b: GridNodeInterface) => { // estimated 'cheapest' path from a to b
    let distance = Math.abs(b.x - a.x) + Math.abs(b.y - a.y);

    return distance;
}

export default Astar;