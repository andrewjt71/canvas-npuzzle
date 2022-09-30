/**
 * Painter constructor.
 * 
 * @var {Object} element
 * @var {Object} image
 * 
 * @return {Object}
 */
let Painter = function (element, image) {
    this.image = image;
    this.element = element;

    // Create a context with a canvas.
    this.context = function () {
        let canvas = document.createElement('canvas');
        element.append(canvas);
        canvas.width = element.offsetWidth;
        canvas.height = element.offsetHeight;

        return canvas.getContext('2d');
    }();
};

/**
 * Paint a node to a canvas.
 * 
 * @param {Node} node
 */
Painter.prototype.paint = function (node) {
    this._clear();
    let targetSlot = 0;
    for (let i = 0; i < node.config.length; i++) {
        this._paintTile(targetSlot, node.config[i], Math.sqrt(node.config.length));
        targetSlot++;
    }
};

/**
 * Clear the canvas.
 */
Painter.prototype._clear = function () {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
};

/**
 * Paint a given tile.
 * 
 * @param {int} targetSlot
 * @param {int} tile
 * @param {int} dimension
 */
Painter.prototype._paintTile = function (targetSlot, tile, dimension) {
    let tileWidth = this.image.width / dimension,
        tileHeight = this.image.height / dimension,
        targetColWidth = this.element.offsetWidth / dimension,
        targetRowHeight = this.element.offsetHeight / dimension,
        targetCol = targetSlot % dimension,
        targetRow = Math.floor(targetSlot / dimension),
        tileCol = tile % dimension,
        tileRow = Math.floor(tile / dimension);

    if (tile === 0) {
        this.context.fillRect(
            targetCol * targetColWidth, // image placement x
            targetRow * targetRowHeight, // image placemant y
            targetColWidth, // image width
            targetRowHeight, // image height
        );

        return;
    }

    this.context.drawImage(
        this.image,
        tileWidth * tileCol, // start of original image x position
        tileHeight * tileRow, // start of original image y position
        tileWidth, // original image crop width
        tileHeight, // original image crop height
        targetCol * targetColWidth, // image placement x
        targetRow * targetRowHeight, // image placemant y
        targetColWidth, // image width
        targetRowHeight, // image height
    );

    this.context.canvas.strokeStyle = '#f00';  // some color/style
    this.context.canvas.lineWidth = 2;         // thickness
    this.context.strokeRect(
        targetCol * targetColWidth, // image placement x
        targetRow * targetRowHeight, // image placement y
        targetColWidth, // image width
        targetRowHeight, // image height
    );
};

export default Painter;
