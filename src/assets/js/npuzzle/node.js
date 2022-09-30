/**
 * 
 * @param {*} config 
 * @param {Object} parent
 */
let Node = function (config, parent = null) {
    this.config = config;
    this.parent = parent;
    this.dimension = Math.sqrt(this.config.length);

    // Calculate the g value.
    if (this.parent == null) {
        this.gValue = 0;
    } else {
        this.gValue = this.parent.getGValue() + 1;
    }

    // Calculate the h value.
    this.hValue = this._getManhattanDistance();

    // Calculate the f value.
    this.fValue = this.hValue + this.gValue;
};

/**
 * Calculate the manhattan distance of the node.
 * 
 * @return {int}
 */
Node.prototype._getManhattanDistance = function () {
    let distance = 0;
    for (let i = 0; i < this.config.length; i++) {
        if (this.config[i] === 0) {
            continue;
        }

        let tileValue = this.config[i],
            puzzleCol = tileValue % this.dimension,
            puzzleRow = Math.floor(tileValue / this.dimension),
            pieceCol = i % this.dimension,
            pieceRow = Math.floor(i / this.dimension);

        distance += Math.abs(puzzleCol - pieceCol);
        distance += Math.abs(puzzleRow - pieceRow);
    }

    return distance;
};

/**
 * Determine whether space is in the first column of the board.
 * 
 * @return {boolean}
 */
Node.prototype._onLeft = function () {
    let spacePlacement = this.config.indexOf(0);

    return spacePlacement % this.dimension === 0;
};

/**
 * Determine whether space is in the last column of the board.
 * 
 * @return {boolean}
 */
Node.prototype._onRight = function () {
    let spacePlacement = this.config.indexOf(0);

    return spacePlacement % this.dimension === this.dimension - 1;
};

/**
 * Determine whether space is in the first row of the board.
 * 
 * @return {boolean}
 */
Node.prototype._onTop = function () {
    let spacePlacement = this.config.indexOf(0);

    return spacePlacement < this.dimension;
};

/**
 * Determine whether space is in the last row of the board.
 * 
 * @return {boolean}
 */
Node.prototype._onBottom = function () {
    let spacePlacement = this.config.indexOf(0);

    return spacePlacement >= this.dimension * (this.dimension - 1);
};

/**
 * Calculate and return all possible child nodes of this node.
 * 
 * @return {array}
 */
Node.prototype.getChildren = function () {
    let children = [];

    if (!this._onRight()) {
        let child = this._createFromRightMove();
        children.push(child);
    }

    if (!this._onLeft()) {
        let child = this._createFromLeftMove();
        children.push(child);
    }

    if (!this._onTop()) {
        let child = this._createFromUpMove();
        children.push(child);
    }

    if (!this._onBottom()) {
        let child = this._createFromDownMove();
        children.push(child);
    }

    return children;
};

/**
 * Generate a random child of the current node and return. Do not create parent link.
 * 
 * @return {Node}
 */
Node.prototype.getRandomSlide = function () {
    let options = [];

    if (!this._onRight()) {
        options.push(this.MOVE_RIGHT);
    }

    if (!this._onLeft()) {
        options.push(this.MOVE_LEFT);
    }

    if (!this._onTop()) {
        options.push(this.MOVE_UP);
    }

    if (!this._onBottom()) {
        options.push(this.MOVE_DOWN);
    }

    let rand = options[Math.floor(Math.random() * options.length)];

    switch (rand) {
        case this.MOVE_RIGHT:
            return this._createFromRightMove(false);
        case this.MOVE_LEFT:
            return this._createFromLeftMove(false);
        case this.MOVE_UP:
            return this._createFromUpMove(false);
        case this.MOVE_DOWN:
            return this._createFromDownMove(false);
    }
};

/**
 * Create a child of this node by moving the space right one place.
 * 
 * @param {boolean} link Whether a parent link should be created.
 * 
 * @return {Node}
 */
Node.prototype._createFromRightMove = function (link = true) {
    let config = this.config.slice(),
        spacePlacement = config.indexOf(0),
        posOfTileToRight = spacePlacement + 1,
        child;

    config[spacePlacement] = config[posOfTileToRight];
    config[posOfTileToRight] = 0;

    if (link) {
        child = new Node(config, this);
    } else {
        child = new Node(config, null);
    }

    return child;
};

/**
 * Create a child of this node by moving the space left one place.
 * 
 * @param {boolean} link Whether a parent link should be created.
 * 
 * @return {Node}
 */
Node.prototype._createFromLeftMove = function (link = true) {
    let config = this.config.slice(),
        spacePlacement = config.indexOf(0),
        posOfTileToLeft = spacePlacement - 1,
        child;

    config[spacePlacement] = config[posOfTileToLeft];
    config[posOfTileToLeft] = 0;

    if (link) {
        child = new Node(config, this);
    } else {
        child = new Node(config, null);
    }

    return child;
};

/**
 * Create a child of this node by moving the space up one place.
 * 
 * @param {boolean} link Whether a parent link should be created.
 * 
 * @return {Node}
 */
Node.prototype._createFromUpMove = function (link = true) {
    let config = this.config.slice(),
        spacePlacement = config.indexOf(0),
        posOfTileAbove = spacePlacement - this.dimension,
        child;

    config[spacePlacement] = config[posOfTileAbove];
    config[posOfTileAbove] = 0;

    if (link) {
        child = new Node(config, this);
    } else {
        child = new Node(config, null);
    }

    return child;
};

/**
 * Create a child of this node by moving the space down one place.
 * 
 * @param {boolean} link Whether a parent link should be created.
 * 
 * @return {Node}
 */
Node.prototype._createFromDownMove = function (link = true) {
    let config = this.config.slice(),
        spacePlacement = config.indexOf(0),
        posOfTileBelow = spacePlacement + this.dimension,
        child;

    config[spacePlacement] = config[posOfTileBelow];
    config[posOfTileBelow] = 0;

    if (link) {
        child = new Node(config, this);
    } else {
        child = new Node(config, null);
    }

    return child;
};

/**
 * Slide the tile at the given row and column into the space if it is adjacent.
 * 
 * @param {int} rowOfTile
 * @param {int} colOfTile
 * 
 * @return {Node}
 */
Node.prototype.slide = function (rowOfTile, colOfTile) {
    let spacePlacement = this.config.indexOf(0),
        rowOfSpace = Math.floor(spacePlacement / this.dimension),
        colOfSpace = spacePlacement % this.dimension;

    if (rowOfSpace === rowOfTile) {
        if (colOfSpace - colOfTile === -1) {
            return this._createFromRightMove(false);
        } else if (colOfTile - colOfSpace === -1) {
            return this._createFromLeftMove(false);
        } else {
            return this;
        }
    } else if (colOfSpace === colOfTile) {
        if (rowOfSpace - rowOfTile === -1) {
            return this._createFromDownMove(false);
        } else if (rowOfTile - rowOfSpace === -1) {
            return this._createFromUpMove(false);
        } else {
            return this;
        }
    } else {
        return this;
    }
};

/**
 * Return the f value of the node.
 * 
 * @return {int}
 */
Node.prototype.getFValue = function () {
    return this.fValue;
};

/**
 * Return the g value of the node.
 * 
 * @return {int}
 */
Node.prototype.getGValue = function () {
    return this.gValue;
};

/**
 * Return the parent of the node.
 * 
 * @return {Node}
 */
Node.prototype.getParent = function () {
    return this.parent;
};

/**
 * Integer representation of a left move.
 */
Node.prototype.MOVE_LEFT = 0;

/**
 * Integer representation of a right move.
 */
Node.prototype.MOVE_RIGHT = 1;

/**
 * Integer representation of an up move.
 */
Node.prototype.MOVE_UP = 2;

/**
 * Integer representation of a down move.
 */
Node.prototype.MOVE_DOWN = 3;

export default Node;
