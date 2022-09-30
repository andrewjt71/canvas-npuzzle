/**
 * TerminalOutput Constructor.
 */
let TerminalOutput = function (element) {
    this.element = element;
};

/**
 * Write some text to the terminal.
 * 
 * @param {string} text
 */
TerminalOutput.prototype.write = function (text) {
    return new Promise(function (resolve, reject) {
        // Remove blink cursor.
        let blink = document.getElementsByClassName("blink")[0];
        if (blink !== undefined) {
            this.element.removeChild(blink);
        }

        // Print characters to the DOM with a time interval.
        let i = 0,
            timer = setInterval(function () {
            this.element.innerHTML += text[i];

            // Ensure terminal scrolls to the bottom as content is added.
            this.element.scrollTop = this.element.scrollHeight;

            i++;

            // If i = text.length then processing of the current message is complete.
            if (i === text.length) {
                // Clear the interval and add a new line and re add the blink cursor.
                clearInterval(timer);
                this.element.innerHTML += "<br>"
                this.element.innerHTML += '<span class="blink"></span>';
                this.element.scrollTop = this.element.scrollHeight;
                resolve();
            }
        }.bind(this), 10);
    }.bind(this));
};

TerminalOutput.prototype.show = function () {
    this.element.classList.remove('npuzzle__terminal--hidden');
};

TerminalOutput.prototype.hide = function () {
    this.element.classList.add('npuzzle__terminal--hidden');
    this.element.innerHTML = '<span class="blink"></span>';
};

/**
 * Process a message.
 */
TerminalOutput.prototype.process = function (text) {

};

export default TerminalOutput;
