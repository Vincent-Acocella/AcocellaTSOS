/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {
        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public userInput = "",
                    public cmdHistory = [],
                    public tabIndex = 0
                    ) {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                var chr = _KernelInputQueue.dequeue();
                //Tab key for autocomplete
                //get the list of commands seperated by a comma list
                //TO DO: Allow the arrow buttons to navigate thru list

                    if(chr === String.fromCharCode(8)) { //Backspace
                        this.backspace();
                    }else if(chr === String.fromCharCode(9)) { 
                        let options =[];
                        if(this.userInput.length != 0){
                            options = this.getTabList(this.userInput);
                            if(options.length == 1){
                                this.clearCmdLine(options[0]);
                            }else{
                                this.clearCmdLine(options.toString());
                                this.advanceLine();
                            }
                        }
                    }else if (chr=== "upArrow"){
                        if(this.cmdHistory.length > 0 && this.cmdHistory.length > this.tabIndex+1){
                            this.clearCmdLine(this.cmdHistory[this.tabIndex +1]);
                            this.tabIndex++;
                        }
                    }else if(chr ==="downArrow"){
                        if(this.tabIndex > 0){
                            this.clearCmdLine(this.cmdHistory[this.tabIndex-1]);
                            this.tabIndex--;
                        }
                    }else if (chr === String.fromCharCode(13)) { // the Enter key
                        _Kernel.krnTrace("!!!!!!!!!!!!!!" + this.userInput + "!!!!!!!!!!!!!");
                        _OsShell.handleInput(this.userInput);
                        this.cmdHistory.push(this.userInput);
                        // ... and reset our buffer.
                        this.userInput = "";
                    } else {
                        if(this.tabIndex !== -1){
                            this.tabIndex =-1;
                        }
                        this.putText(chr);
                        this.userInput += chr;
                    }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }

        public putText(text): void {
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(): void {
            this.currentXPosition = 0;
            var lineSize = this.currentFontSize+ _DefaultFontSize  + _FontHeightMargin; //Y of line
            if (this.currentYPosition + lineSize > _Canvas.height) { // Checks if current bar is showing
                var oldCanvas = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height); //Save that there canvas because we've lost the ability to type
                this.clearScreen(); 
                //void ctx.putImageData(imageData, dx, dy);
                _DrawingContext.putImageData(oldCanvas, 0, - lineSize);// Move her up WE GOT A BIG ONE
            }
            else {
                this.currentYPosition += lineSize; //Its a little one try typing menu next time. I want you to. See what happens
            }
        }

        public backspace(): void{
            if(this.userInput.length > 0){
                this.userInput = this.userInput.substr(0, this.userInput.length - 1);
                this.clearCmdLine(this.userInput);
            }
        }

        public clearCmdLine(val): void{
            _DrawingContext.clearRect(0, this.currentYPosition - this.currentFontSize, //Removes the height
                    this.currentXPosition, //keep x position for now
                    this.currentFontSize + _FontHeightMargin); 
            this.currentXPosition = 0; //Reset x to start
            this.userInput = val;
            this.putText("<~>" + val);
        }

        public getTabList(stg){
            let options = [];
            let cmdList = _OsShell.commandList;
            for(let i = 0; i < cmdList.length; i++){
                if(cmdList[i].command.substr(0, stg.length) === stg) {
                    options.push(cmdList[i].command);
                }
            }
            return options;
        }
    }
 }
