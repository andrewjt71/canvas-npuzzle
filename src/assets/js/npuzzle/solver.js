import Solution from "./solution";
import Utility from "./utility";

/**
 * Solver Constructor.
 */
let Solver = function () {

};

/**
 * Solve an npuzzle using the IDA* algorithm.
 * 
 * @param {Node} initialNode
 * @param {array} targetConfig
 */
Solver.prototype.solveWithIDAStar = function (initialNode, targetConfig) {
    let solutionNode = null,
        numberOfExpansions = 0,
        timeStarted = Date.now(),
        fLimit = initialNode.getFValue();

    function fetchSolutionOrNextLimit(node, fLimit) {
        let nextFLimit = 1000000000;

        if (node.getFValue() > fLimit) {
            return node.getFValue();
        }

        if (Utility.compareArrays(node.config, targetConfig)) {
            solutionNode = node;

            return node.getFValue();
        }

        let children = node.getChildren();

        numberOfExpansions++;

        for (let childIndex = 0; childIndex < children.length; childIndex++) {
            let child = children[childIndex],
                newFLimit = fetchSolutionOrNextLimit(child, fLimit);

            if (solutionNode !== null) {
                return fLimit;
            }

            if (newFLimit < nextFLimit) {
                nextFLimit = newFLimit;
            }
        }

        return nextFLimit;
    }

    numberOfExpansions++;

    while (solutionNode == null) {
        fLimit = fetchSolutionOrNextLimit(initialNode, fLimit);
    }

    let timeTaken = Date.now() - timeStarted;

    return new Solution(solutionNode, timeTaken, numberOfExpansions);
};

export default Solver;
