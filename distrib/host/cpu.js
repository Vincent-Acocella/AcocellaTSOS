/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    //Fix print
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, IR, endOfProg, bytesNeeded, segment, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (IR === void 0) { IR = "0"; }
            if (endOfProg === void 0) { endOfProg = 0; }
            if (bytesNeeded === void 0) { bytesNeeded = 0; }
            if (segment === void 0) { segment = -1; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.endOfProg = endOfProg;
            this.bytesNeeded = bytesNeeded;
            this.segment = segment;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = "";
            this.endOfProg = 0;
            this.segment = -1;
            this.bytesNeeded = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            var moveThatBus = this.fetch(this.PC);
            if (moveThatBus < 0) {
                this.PC = (-1 * moveThatBus) - 1 % 256;
                if (this.PC > this.endOfProg) {
                    _StdOut.putText("Branched out of memory");
                }
                //Time to branch
            }
            else {
                //Increment by bytes
                this.PC += moveThatBus;
            }
            //This Line has to Change
            if (this.PC > this.endOfProg) {
                _PCB.state = "Complete";
                _Schedular.removeFromReadyQueue();
                _Schedular.quant = 0;
            }
            _PCB.updateScheduler();
            _DeviceDisplay.cycleReload();
            //Check to see if we need to switch units
            //LEFT OFF HERE. NEED TO MAKE A CHECK FOR END OF ALL PROGRAMS 
            if (_Schedular.checkIfSwitch()) {
                _Schedular.switchMemoryUnit();
            }
            else {
                if (_Schedular.readyQueue.getSize() !== 1)
                    _Schedular.decreaseQuantum();
            }
            _DeviceDisplay.startUpMemory();
            //_DeviceDisplay.updateMemory(this.segment, this.PC);
            //Update CPU and memory display in one cycle     
        };
        Cpu.prototype.fetch = function (PC) {
            var opCode = _MemoryAccessor.read(PC, this.segment);
            this.IR = opCode.toString();
            switch (opCode) {
                //Load the accumulator with a constant
                case "A9":
                    this.loadAcc(PC);
                    break;
                //Load the accumulator from memory
                case "AD":
                    this.loadAccFrmMem(PC);
                    break;
                //store the accumulator in memory
                case "8D":
                    this.strAccInMem(PC);
                    break;
                //Add a carry
                case "6D":
                    this.addCarry(PC);
                    break;
                //Load the X register with a constant
                case "A2":
                    this.loadXregCons(PC);
                    break;
                //Load the X register from memory
                case "AE":
                    this.loadXregMem(PC);
                    break;
                //Load the Y register with a constant
                case "A0":
                    this.loadYregCons(PC);
                    break;
                //Load the Y register from memory
                case "AC":
                    this.loadYregMem(PC);
                    break;
                //No operation
                case "EA":
                    this.bytesNeeded = 1;
                    break;
                //break (which is really a system call)
                case "00":
                    this["break"]();
                    break;
                //compare a byte in memory to the X reg. sets Z flag if =
                case "EC":
                    this.compXmem(PC);
                    break;
                //Branch n bytes if Z flag = 0
                case "D0":
                    this.branchIfZ(PC);
                    break;
                //Increment the value of a byte
                case "EE":
                    this.incremVal(PC);
                    break;
                //System Call
                case "FF":
                    this.systemCall(PC);
                    break;
                default:
            }
            return this.bytesNeeded;
        };
        //----------------------------------------------------------------------------------
        //Bytes needed = 1
        //FF
        Cpu.prototype.systemCall = function (code) {
            this.bytesNeeded = 1;
            switch (_CPU.Xreg) {
                case 1: // Print integer from y register
                    _CPU.printIntYReg();
                    break;
                case 2: // Print 00 terminated string from y register
                    _CPU.printStringYReg();
                    break;
                default:
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_STRING, ["Invalid system call operation, stoping execution."]));
            }
        };
        //----------------------------------------------------------------------------------
        //good
        //A9
        Cpu.prototype.loadAcc = function (value) {
            this.bytesNeeded = 2;
            //Loads next value in memory
            var newValue = _MemoryAccessor.read(value + 1, this.segment);
            this.Acc = this.convToHex(newValue);
        };
        //All of this has to change
        //----------------------------------------------------------------------------------
        //good
        //AD
        Cpu.prototype.loadAccFrmMem = function (value) {
            this.bytesNeeded = 3;
            //First byte is the op
            //Second is the segment
            //thrid is the location
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var valueInMemory = _MemoryAccessor.read(value + 1, segmentToLook);
                this.Acc = valueInMemory;
            }
        };
        //----------------------------------------------------------------------------------
        //good
        //8D
        //Store the Acc in memory
        //value +2 is where to store 
        Cpu.prototype.strAccInMem = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var spotInMem = _MemoryAccessor.read(value + 1, segmentToLook);
                _Memory.memoryThread[segmentToLook][spotInMem] = this.Acc;
            }
        };
        //----------------------------------------------------------------------------------
        //6D
        Cpu.prototype.addCarry = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var valueToAdd = _MemoryAccessor.read(value + 1, segmentToLook);
                this.Acc = this.Acc + valueToAdd;
            }
        };
        //----------------------------------------------------------------------------------
        //A2
        //GOOD?
        Cpu.prototype.loadXregCons = function (value) {
            this.bytesNeeded = 2;
            //Loads next value in memory
            var newValue = _MemoryAccessor.read(value + 1, this.segment);
            this.Xreg = this.convToHex(newValue);
        };
        //----------------------------------------------------------------------------------
        //AE
        //GOOD
        Cpu.prototype.loadXregMem = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var valueInMemory = _MemoryAccessor.read(value + 1, segmentToLook);
                this.Xreg = valueInMemory;
            }
        };
        //----------------------------------------------------------------------------------
        //A0
        //GOOD?
        Cpu.prototype.loadYregCons = function (value) {
            this.bytesNeeded = 2;
            //Loads next value in memory
            var newValue = _MemoryAccessor.read(value + 1, this.segment);
            this.Yreg = this.convToHex(newValue);
        };
        //----------------------------------------------------------------------------------
        //AC
        //GOOD?
        Cpu.prototype.loadYregMem = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var valueInMemory = _MemoryAccessor.read(value + 1, segmentToLook);
                this.Yreg = valueInMemory;
            }
        };
        //----------------------------------------------------------------------------------
        //EC
        Cpu.prototype.compXmem = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var valueToCompair = _MemoryAccessor.read(value + 1, segmentToLook);
                console.log(valueToCompair);
                this.Zflag = (this.Xreg === valueToCompair) ? 1 : 0;
            }
        };
        //----------------------------------------------------------------------------------
        //EC
        Cpu.prototype.branchIfZ = function (value) {
            if (this.Zflag === 0) {
                //Gets location to set the program counter to
                // this.PC = this.convToHex(_Memory.memoryThread[value + 1]);
                //If we are branching to 0
                if (this.PC === 0) {
                    this.bytesNeeded = -1;
                }
                else {
                    this.bytesNeeded = (-1 * (this.PC + 1));
                }
            }
            else {
                this.bytesNeeded = 2;
            }
        };
        //----------------------------------------------
        //EE
        //GOOOD
        Cpu.prototype.incremVal = function (value) {
            this.bytesNeeded = 3;
            var segmentToLook = this.returnSegmentFromMemory(_MemoryAccessor.read(value + 2, this.segment));
            if (segmentToLook < 0) {
                _StdOut.putText("Invalid opcode detected");
            }
            else {
                var location_1 = _MemoryAccessor.read(value + 1, this.segment);
                _Memory.memoryThread[segmentToLook][location_1] = _Memory.memoryThread[segmentToLook][location_1] + 1;
            }
        };
        Cpu.prototype["break"] = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(STOP_EXEC_IRQ, ["PID " + _PCB.PID + " has finished."]));
        };
        //----------------------------------------------------------------------------------
        //----------------------------------------------------------------------------------      
        // ----------------------------------------------------------------------------------
        //FIX FIX FIX  
        Cpu.prototype.printIntYReg = function () {
            // #$01 in X reg = print the integer stored in the Y register.
            _StdOut.putText(this.Yreg.toString());
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_YREGInt_ERQ, ["Printing int from X register"]));
        };
        Cpu.prototype.printStringYReg = function () {
            // #$02 in X reg = print the 00-terminated string stored at the address in
            //  the Y register.
            _StdOut.putText(_CPU.Yreg);
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_STRING, ["Printing int from X register"]));
        };
        // ----------------------------------------------------------------------------------
        //CPU Utils
        Cpu.prototype.returnCPU = function () {
            return [this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag];
        };
        Cpu.prototype.convToHex = function (value) {
            return parseInt(value.toString(), 16);
        };
        //If this errors then there is an error in the code
        Cpu.prototype.returnSegmentFromMemory = function (byte) {
            var temp = -1;
            switch (byte) {
                case "00":
                    temp = 0;
                    break;
                case "01":
                    temp = 1;
                    break;
                case "02":
                    temp = 2;
                    break;
                default:
                    return -1;
            }
            //If false that means it is in use which is good
            if (!_MemoryManager.avaliableMemory[temp]) {
                return temp;
            }
            return -1;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
