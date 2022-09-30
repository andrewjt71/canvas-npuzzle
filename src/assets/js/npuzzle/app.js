import Painter from "./painter";
import Node from "./node";
import Solver from "./solver";
import TerminalOutput from "./terminalOutput";

/**
 * Npuzzle application constructor.
 * 
 * @param {Object} element 
 */
let NPuzzleApp = function (element, image) {
    this.element = element;
    this.painter = new Painter(element, image);
    this.dimension = 3;
    this.solutionPlayable = false;
    this.solution = null;

    // Generate solution config dynamically.
    this.solutionConfig = [];
    for (let i = 0; i < this.dimension * this.dimension; i++) {
        this.solutionConfig.push(i);
    }

    this.solver = new Solver();
    this.terminalOutput = new TerminalOutput(document.querySelectorAll('[data-npuzzle-terminal]')[0]);
};

/**
 * Initialisation method.
 */
NPuzzleApp.prototype.init = function () {
    this._initialiseEventListeners();
    this.currentNode = new Node(this.solutionConfig);
    this.painter.paint(this.currentNode);
};

/**
 * Initialise event listeners.
 */
NPuzzleApp.prototype._initialiseEventListeners = function () {
    this._initialiseTileClickEvents();
    this._initialiseShuffleEvents();
    this._initialisePuzzleSolveEvents();
    this._initialiseSolverHotKey();
};

/**
 * Initialise events to handle npuzzle tile clicks.
 */
NPuzzleApp.prototype._initialiseTileClickEvents = function () {
    let navHeight = document.getElementsByClassName('header')[0].offsetHeight;

    this.element.onclick = function (e) {

        let targetCol = Math.floor((e.pageX - this.element.parentElement.offsetLeft)/ (this.element.parentElement.offsetWidth / this.dimension)),
            targetRow = Math.floor((e.pageY - navHeight - this.element.offsetTop) / (this.element.offsetHeight / this.dimension));

        this.currentNode = this.currentNode.slide(targetRow, targetCol);
        this.painter.paint(this.currentNode);
    }.bind(this);
};

/**
 * Initialise events to handle shuffling.
 */
NPuzzleApp.prototype._initialiseShuffleEvents = function () {
    document.querySelectorAll('[data-npuzzle-shuffle-btn]')[0].onclick = function () {
        let numberOfShuffles = 50,
            i = 0,
            timer = setInterval(function () {
            this.currentNode = this.currentNode.getRandomSlide();
            this.painter.paint(this.currentNode);
            if (i === numberOfShuffles - 1) {
                clearInterval(timer);
            }
            i++;
        }.bind(this), 50);
    }.bind(this);
};

/**
 * Manage the display of the solution
 */
NPuzzleApp.prototype._updateSolution = function () {
    let i = this.solution.moves.length - 1,
        timer = setInterval(function () {
        this.terminalOutput.hide();
        this.painter.paint(this.solution.moves[i]);
        if (i === 0) {
            this.solutionPlayable = false;
            this.solution = null;
            clearInterval(timer);
        }
        i--;
    }.bind(this), 200);
};

/**
 * Initialise events to handle puzzle solving.
 */
NPuzzleApp.prototype._initialisePuzzleSolveEvents = function () {
    document.querySelectorAll('[data-npuzzle-solve-btn]')[0].onclick = function () {
        this.terminalOutput.show();
        this.terminalOutput.write('Solving puzzle using the IDA* algorithm...')
            .then(function () { let promise = new Promise(function (resolve, reject) { setTimeout(function () { resolve() }, 500); }); return promise; })
            .then(function () {
                this.solution = this.solver.solveWithIDAStar(this.currentNode, this.solutionConfig);
                this.terminalOutput.write('Solution found')
                    .then(function () { return this.terminalOutput.write('* Optimal solution is ' + this.solution.optimalSolutionMoveCount + ' moves') }.bind(this))
                    .then(function () { return this.terminalOutput.write('* Nodes expanded: ' + this.solution.nodesExplored) }.bind(this))
                    .then(function () { return this.terminalOutput.write('* Time taken: ' + this.solution.timeTaken + ' milliseconds') }.bind(this))
                    .then(function () {
                        this.currentNode = new Node(this.solutionConfig);
                        this.solutionPlayable = true;
                        return this.terminalOutput.write('* Hit space / click play solution...')
                    }.bind(this))
            }.bind(this));
    }.bind(this);
};

NPuzzleApp.prototype._initialiseSolverHotKey = function () {
    // Add event listener for key ups
    document.onkeyup = function (e) {
        this._handleKeyEvent(e.key);
    }.bind(this);

    document.querySelectorAll('[data-npuzzle-play-btn]')[0].onclick = function () {
        if (this.solutionPlayable) {
            this._updateSolution();
        }
    }.bind(this);
};

NPuzzleApp.prototype._handleKeyEvent = function (key) {
    switch (key) {
        case ' ':
            if (this.solutionPlayable) {
                this._updateSolution();
            }
            break;
    }
};

export default NPuzzleApp;
