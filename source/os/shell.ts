/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = "<~>";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        constructor(
        ) {
        }

        public init() {
            var sc: ShellCommand;
            // Load the command list.
            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            //date
            sc = new ShellCommand(this.shellDate, 
                                "date",
                                "-Displays the current dateTime.")
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatus, 
                "status",
                "-set a new status.")
            this.commandList[this.commandList.length] = sc;

            //whereami                   
            sc = new ShellCommand(this.shellWhereAmi, 
                                "whereami",
                                "-You were probably frozen for 70 years.")
            this.commandList[this.commandList.length] = sc;

            //flipacoin
            sc = new ShellCommand(this.shellcoinflip, 
                                "flipacoin",
                                "-Heads or Tails.")
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellError,
                                    "error",
                                    "- Force an error on the OS....Psycho");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellLoad,
                "load",
                "- LoadHouse validate code");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRun,
                "run",
                "- runCode");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRunAll,
                "runall",
                "- runCode");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellClearMem,
                "clearmem",
                "- runCode");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellPS,
                "ps",
                "- runCode");
            this.commandList[this.commandList.length] = sc;


            sc = new ShellCommand(this.shellKillAll,
                "killall",
                "- runCode");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellKill,
                "kill",
                "- runCode");
            this.commandList[this.commandList.length] = sc;


            sc = new ShellCommand(this.shellQuantum,
                "quantum",
                "- runCode");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellFormat,
                "format",
                "- Format Thing");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellCreate,
                "create",
                "- Create Thing");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellDelete,
                "delete",
                "- Create Thing");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellWrite,
                "write",
                "- Write to File");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellRead,
                "read",
                "- Read File");
            this.commandList[this.commandList.length] = sc;

            sc = new ShellCommand(this.shellList,
                "ls",
                "- List Programs");
            this.commandList[this.commandList.length] = sc;

        }
        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            // _Kernel.krnTrace("!!!!!!"+ buffer + "!!!!!!");
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;

            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);  // Note that args is always supplied, though it might be empty.
            } else {
                
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
           
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
              //  _Kernel.krnTrace("!!!!!!HERE?????!!!!");
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            //("!!!!!!!!!! little detore huh");
            this.putPrompt();
        }

        public parseInput(buffer: string): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            // _Kernel.krnTrace("I HEArD YOURE THE TOUGHEST GUY HERE");
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.

        public shellVer(args: string[]) {
            _StdOut.putText(SHISUTEMU + " version " + APP_VERSION);
        }

        public shellHelp(args: string[]) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args: string[]) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }

        public shellCls(args: string[]) {         
            _StdOut.clearScreen();     
            _StdOut.resetXY();
        }

        public shellMan(args: string[]) {
            let line;
            if (args.length > 0)
                line = (args[0] == "help") ? "Help displays a list of (hopefully) valid commands." : "No manual entry for" + args[0] + ".";
             else 
                line = ("Usage: man <topic>  Please supply a topic.");
            _StdOut.putText(line);
        }

        public shellTrace(args: string[]) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args: string[]) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args: string[]) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args:string[]){_StdOut.putText(Date());}
        
        public shellWhereAmi(args:string[]){_StdOut.putText("In a recover room in New York City. Where am I really, the game is from 1941 and I know because I was there.");}
        
        public shellcoinflip(args: string[]){
            var result = (Math.floor(Math.random() * 2) == 0) ? "HEADS" : "TAILS";
            _StdOut.putText(result);
        }

        public shellStatus(args: string[]){
            if (args.length > 0) {
                document.getElementById("status").innerHTML = args[0];
            }else{
                _StdOut.putText("Please type a status");
            }
        }

        public shellError(args: String[]){
            _StdOut.putText("AHHHHHHHHHHHHHHH WHY MUST YOU CAUSE ME HARM FOR A DAMN TEST YOU BASTARD");
            _Kernel.krnTrapError("AHHHHHHHHHHHHHHH WHY MUST YOU CAUSE ME HARM FOR A DAMN TEST YOU BASTARD");
        }

        public shellLoad(args: String[]){
            let program = (<HTMLInputElement>document.getElementById("taProgramInput")).value;

            if(program.length > 0) {
                //removes sequential space
                program = program.replace(/\s+/g, " ").trim();
                if (!program.match(/^[a-fA-F0-9\s]+$/) && !(program.length > 256)) {
                   _StdOut.putText("The file you entered is not in appropriete format.");
                   _StdOut.advanceLine();
                   _StdOut.putText("Input greater than 256 or hexidecimal format")
               } else {
                   let progNum = _MemoryManager.loadMemory(program);
                   if(progNum < 0){
                    _StdOut.putText("No avaliable memory for use");
                   }else{
                    _StdOut.putText("Type 'run " + progNum +"' To run code");
                    //_DeviceDisplay.updateMemory();
                   }   
               }
           }else{
                _StdOut.putText("No Program to Load");
            }
        }

        public shellRun(args: String[]){

            if(args.length > 0){
                _MemoryManager.runMemory(args)
            } else{
                _StdOut.putText("Please input a program");
            }
        }

        public shellRunAll(){
            //Get programs and add them to the ready queue
            //Take all programs in memory and add them to the ready queue
            _Schedular.addAllToReadyQueue();
        }

        public shellClearMem(){
            //Get the programs by segment
            //Change their state to terminated
            // clear memory
            _MemoryAccessor.clearAllMemory();
            _StdOut.putText("Memory Cleared!");
        }

        public shellPS(){

            //Display allProcesses
            let returnList = _MemoryManager.listProgsInMem();

            if(returnList < 1){
                for(let output in returnList){
                    _StdOut.putText(output);
                }
            }else{
                _StdOut.putText("No programs in memory");
            }
        }

        public shellKillAll(){
            // leave in memory but terminate all processes
            console.log("hrello")
            var dateTime = new Date().getFullYear();
            console.log(dateTime);


        }

        public shellKill(){
            //leave in memory but kill process
            //remove from ready Queue

        }

        public shellQuantum(args:string){
            //Chnage quantum
            //check for int?
            if(args.length > 0){
                _Quant = parseInt(args)
                _StdOut.putText("The Quantum has been changed to: " + args)
            }
        }

        public shellFormat(){

            if(_DeviceDiskDriver.formatDisk()){
                _StdOut.putText("Disk Formatted");
            }else{
                _StdOut.putText("Disk Already Formatted");
            }
        }

        public shellCreate(args:string){
            if(args.length > 0){
                if(_FORMATTED){
                    if(_DeviceDiskDriver.createFile(args.toString())){
                        _StdOut.putText("Created file " + args.toString())

                    }else{
                        _StdOut.putText("No, " + args.toString()+ " Already exists");
                    }
                }else{
                _StdOut.putText("Please format hard drive.")
                }
            }else{
                _StdOut.putText("create <fileName>");
            }
        }

        public shellDelete(args:string){

            if(args.length > 0){
                if(_FORMATTED){
                    if(_DeviceDiskDriver.deleteFile(args.toString())){
                        _StdOut.putText("Deleted " + args.toString());
                    }else{
                        _StdOut.putText("Could not delete " + args.toString())
                    }
                }else{
                    _StdOut.putText("Please format hard drive.")
                }
            }else{
                _StdOut.putText("delete <fileName>");
            }
        }
        public shellWrite(args:string){
            if(args.length > 1){
                let filename = args[0];
                if(_FORMATTED){
                    if(_DeviceDiskDriver.writeToFile(args)){
                        _StdOut.putText("Wrote to " + filename);
                        //wrote to file
                    }else{
                       
                        _StdOut.putText("Could not write to " + filename);
                    }
                }else{
                    _StdOut.putText("Please format hard drive.");
                }
            }else{
                _StdOut.putText('write <fileName> "<text>"');
            }
        }
        public shellRead(args:string){
            if(args.length > 0){
                if(_FORMATTED){
                    let output =_DeviceDiskDriver.readFile(args.toString());
                    _StdOut.putText(output)
                }else{
                    _StdOut.putText("Please format hard drive.");
                }
            }else{
                _StdOut.putText('read <fileName> ');
            }
        }

        public shellList(){
            let listReturned = _DeviceDiskDriver.listAvaliableFiles();
            if(listReturned.length > 0){
                for(let item in listReturned){
                    _StdOut.putText(listReturned[item])
                    _StdOut.advanceLine();
                }
            }
        }

        public shellSetSchedule(args:string){
            //set priority for PCB
            //ENable swapping

        }

        public shellGetSchedule(){

        }

    }
}