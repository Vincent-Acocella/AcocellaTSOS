/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = /** @class */ (function () {
        function Shell() {
            // Properties
            this.promptStr = "<~>";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            //date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "-Displays the current dateTime.");
            this.commandList[this.commandList.length] = sc;
            //status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "-set a new status.");
            this.commandList[this.commandList.length] = sc;
            //whereami                   
            sc = new TSOS.ShellCommand(this.shellWhereAmi, "whereami", "-You were probably frozen for 70 years.");
            this.commandList[this.commandList.length] = sc;
            //flipacoin
            sc = new TSOS.ShellCommand(this.shellcoinflip, "flipacoin", "-Heads or Tails.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellError, "error", "- Force an error on the OS....Psycho");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- LoadHouse validate code");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRun, "run", "- runCode");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- clearmem");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- runall");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellPS, "ps", "- ps");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- kill");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "- clearmem");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
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
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            // _Kernel.krnTrace("I HEArD YOURE THE TOUGHEST GUY HERE");
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(SHISUTEMU + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            var line;
            if (args.length > 0)
                line = (args[0] == "help") ? "Help displays a list of (hopefully) valid commands." : "No manual entry for" + args[0] + ".";
            else
                line = ("Usage: man <topic>  Please supply a topic.");
            _StdOut.putText(line);
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellDate = function (args) { _StdOut.putText(Date()); };
        Shell.prototype.shellWhereAmi = function (args) { _StdOut.putText("In a recover room in New York City. Where am I really, the game is from 1941 and I know because I was there."); };
        Shell.prototype.shellcoinflip = function (args) {
            var result = (Math.floor(Math.random() * 2) == 0) ? "HEADS" : "TAILS";
            _StdOut.putText(result);
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length > 0) {
                document.getElementById("status").innerHTML = args[0];
            }
            else {
                _StdOut.putText("Please type a status");
            }
        };
        Shell.prototype.shellError = function (args) {
            _StdOut.putText("AHHHHHHHHHHHHHHH WHY MUST YOU CAUSE ME HARM FOR A DAMN TEST YOU BASTARD");
            _Kernel.krnTrapError("AHHHHHHHHHHHHHHH WHY MUST YOU CAUSE ME HARM FOR A DAMN TEST YOU BASTARD");
        };
        //Add	a	shell	command	called	load	to	validate	the	user	code	in	the	HTML5	
        //text	area	(id=	“taProgramInput”).	Only	hex	digits	and	spaces	are	valid.
        //A-F 0-9
        Shell.prototype.shellLoad = function (args) {
            var program = document.getElementById("taProgramInput").value;
            if (program.length > 0) {
                //removes sequential space
                program = program.replace(/\s+/g, " ").trim();
                if (!program.match(/^[a-fA-F0-9\s]+$/)) {
                    _StdOut.putText("The file you entered is not in hexidecimal format.");
                }
                else {
                    // _StdOut.putText("The file you entered has the wrong amount of chars.");
                    //console.log("---------Inserting into Memory -----------------")
                    var progNum = _MemoryManager.loadMemory(program);
                    //console.log("---------      Done            -----------------")
                    if (progNum < 0) {
                        _StdOut.putText("Memory is Full!!!!");
                    }
                    else {
                        _StdOut.putText("Type 'run " + progNum + "' To run code");
                        _DeviceDisplay.updateMemory();
                    }
                }
            }
            else {
                _StdOut.putText("No Program to Load");
            }
        };
        Shell.prototype.shellRun = function (args) {
            if (args.length > 0) {
                //Run CPU
                _MemoryManager.runMemory(args);
            }
            else {
                _StdOut.putText("ERROR MESSAGE GOES HERE");
            }
        };
        Shell.prototype.shellClearMem = function (args) {
        };
        //Run all programs at once
        Shell.prototype.shellRunAll = function (args) {
            _MemoryManager.runAllMemory(args);
        };
        //Display the PID and State of all processes
        Shell.prototype.shellPS = function (args) {
        };
        //kill one process
        Shell.prototype.shellKill = function (args) {
            if (args.length > 0) {
                //Run CPU
            }
            else {
                _StdOut.putText("ERROR MESSAGE GOES HERE");
            }
        };
        //Kill all processes
        Shell.prototype.shellKillAll = function (args) {
        };
        //Let The user set the Round Robin quantum
        Shell.prototype.shellQuantum = function (args) {
            if (args.length > 0) {
                _Schedular.setQuant(args);
                _StdOut.putText("The Quantum has been set to" + args);
            }
            else {
                _StdOut.putText("Please enter a Quantum greater than 0");
            }
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
