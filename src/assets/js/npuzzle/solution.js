/**
 * Solution constructor.
 * 
 * @param {Node} solutionNode 
 * @param {int} timeTaken 
 * @param {int} nodesExplored 
 */
let Solution = function (solutionNode, timeTaken, nodesExplored) {
    this.timeTaken = timeTaken;
    this.solutionNode = solutionNode;
    this.nodesExplored = nodesExplored;
    this._process();
};

/**
 * Process a solution. This involves retrospectively traversing the solution's
 * parents to determine the moves which result in the optimal solution.
 */
Solution.prototype._process = function () {
    let moves = [],
        currentNode = this.solutionNode;

    while (currentNode !== null) {
        moves.push(currentNode);
        currentNode = currentNode.getParent();
    }

    this.moves = moves;
    this.optimalSolutionMoveCount = moves.length - 1;
};

export default Solution;
