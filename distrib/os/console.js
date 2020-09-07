/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */
var TSOS;
(function (TSOS) {
    var Console = /** @class */ (function () {
        function Console(currentFont, currentFontSize, currentXPosition, currentYPosition, userInput, cmdHistory, tabIndex) {
            if (currentFont === void 0) { currentFont = _DefaultFontFamily; }
            if (currentFontSize === void 0) { currentFontSize = _DefaultFontSize; }
            if (currentXPosition === void 0) { currentXPosition = 0; }
            if (currentYPosition === void 0) { currentYPosition = _DefaultFontSize; }
            if (userInput === void 0) { userInput = ""; }
            if (cmdHistory === void 0) { cmdHistory = []; }
            if (tabIndex === void 0) { tabIndex = 0; }
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.userInput = userInput;
            this.cmdHistory = cmdHistory;
            this.tabIndex = tabIndex;
        }
        Console.prototype.init = function () {
            this.clearScreen();
            this.resetXY();
        };
        Console.prototype.clearScreen = function () {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        };
        Console.prototype.resetXY = function () {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        };
        Console.prototype.handleInput = function () {
            while (_KernelInputQueue.getSize() > 0) {
                var chr = _KernelInputQueue.dequeue();
                //Tab key for autocomplete
                //get the list of commands seperated by a comma list
                //TO DO: Allow the arrow buttons to navigate thru list
                if (chr === String.fromCharCode(8)) { //Backspace
                    this.backspace();
                }
                else if (chr === String.fromCharCode(9)) {
                    var options = [];
                    if (this.userInput.length != 0) {
                        options = this.getTabList(this.userInput);
                        if (options.length == 1) {
                            this.clearCmdLine(options[0]);
                        }
                        else {
                            this.clearCmdLine(options.toString());
                            this.advanceLine();
                        }
                    }
                }
                else if (chr === "upArrow") {
                    if (this.cmdHistory.length > 0 && this.cmdHistory.length > this.tabIndex + 1) {
                        this.clearCmdLine(this.cmdHistory[this.tabIndex + 1]);
                        this.tabIndex++;
                    }
                }
                else if (chr === "downArrow") {
                    if (this.tabIndex > 0) {
                        this.clearCmdLine(this.cmdHistory[this.tabIndex - 1]);
                        this.tabIndex--;
                    }
                }
                else if (chr === String.fromCharCode(13)) { // the Enter key
                    _Kernel.krnTrace("!!!!!!!!!!!!!!" + this.userInput + "!!!!!!!!!!!!!");
                    _OsShell.handleInput(this.userInput);
                    this.cmdHistory.push(this.userInput);
                    // ... and reset our buffer.
                    this.userInput = "";
                }
                else {
                    if (this.tabIndex !== -1) {
                        this.tabIndex = -1;
                    }
                    this.putText(chr);
                    this.userInput += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        };
        //Prints single letter from input at a time. Might be a better way that runs faster with counting the size of the input and cutting it off if it
        //at that index of the string. This way works well and I have yet to see a difference in computing therefore, I think it is ok to stay for now??
        //I believe later in the course we track cpu cycles so I would re-evaluate at that time.
        Console.prototype.putText = function (userInput) {
            if (userInput !== "") {
                for (var i = 0; i < userInput.length; i++) {
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, userInput[i]);
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, userInput[i]);
                    this.currentXPosition = this.currentXPosition + offset;
                    if (this.currentXPosition + 7 > _Canvas.width) {
                        this.advanceLine();
                    }
                }
            }
        };
        Console.prototype.advanceLine = function () {
            this.currentXPosition = 0;
            var lineSize = this.currentFontSize + _DefaultFontSize + _FontHeightMargin; //Y of line
            if (this.currentYPosition + lineSize > _Canvas.height) { // Checks if current bar is showing
                var oldCanvas = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height); //Save that there canvas because we've lost the ability to type
                this.clearScreen();
                //void ctx.putImageData(imageData, dx, dy);
                _DrawingContext.putImageData(oldCanvas, 0, -lineSize); // Move her up WE GOT A BIG ONE
            }
            else {
                this.currentYPosition += lineSize; //Its a little one try typing help next time. I want you to. See what happens
            }
        };
        Console.prototype.backspace = function () {
            if (this.userInput.length > 0) {
                this.userInput = this.userInput.substr(0, this.userInput.length - 1);
                this.clearCmdLine(this.userInput);
            }
        };
        Console.prototype.clearCmdLine = function (val) {
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, //Removes the height
            this.currentXPosition, //keep x position for now
            this.currentFontSize + _FontHeightMargin);
            this.currentXPosition = 0; //Reset x to start
            this.userInput = val;
            this.putText("<~>" + val);
        };
        Console.prototype.getTabList = function (stg) {
            var options = [];
            var cmdList = _OsShell.commandList;
            for (var i = 0; i < cmdList.length; i++) {
                if (cmdList[i].command.substr(0, stg.length) === stg) {
                    options.push(cmdList[i].command);
                }
            }
            return options;
        };
        return Console;
    }());
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
