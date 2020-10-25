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
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, IR, endOfProg, bytesNeeded, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (IR === void 0) { IR = "0"; }
            if (endOfProg === void 0) { endOfProg = 0; }
            if (bytesNeeded === void 0) { bytesNeeded = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.endOfProg = endOfProg;
            this.bytesNeeded = bytesNeeded;
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
            this.bytesNeeded = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.loadCPU = function (PC, Acc, Xreg, Yreg, Zflag, IR, endOfProg) {
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.endOfProg = endOfProg;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            var moveThatBus = this.fetch(this.PC);
            if (moveThatBus < 0) {
                this.PC = (-1 * moveThatBus) - 1 % 256;
                //Time to branch
            }
            else {
                //Increment by bytes
                this.PC += moveThatBus;
            }
            if (this.PC > this.endOfProg) {
                this.isExecuting = false;
                // _PCB.state = 3;
            }
            _PCB.updatePCB();
            _DeviceDisplay.reload();
            _Schedular.checkIfSwitch();
        };
        Cpu.prototype.fetch = function (code) {
            var opCode = _MemoryManager.fetchCurrentMemory(code);
            this.IR = opCode.toString();
            switch (opCode) {
                //Load the accumulator with a constant
                case "A9":
                    this.loadAcc(code);
                    break;
                //Load the accumulator from memory
                case "AD":
                    this.loadAccFrmMem(code);
                    break;
                //store the accumulator in memory
                case "8D":
                    this.strAccInMem(code);
                    break;
                //Add a carry
                case "6D":
                    this.addCarry(code);
                    break;
                //Load the X register with a constant
                case "A2":
                    this.loadXregCons(code);
                    break;
                //Load the X register from memory
                case "AE":
                    this.loadXregMem(code);
                    break;
                //Load the Y register with a constant
                case "A0":
                    this.loadYregCons(code);
                    break;
                //Load the Y register from memory
                case "AC":
                    this.loadYregMem(code);
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
                    this.compXmem(code);
                    break;
                //Branch n bytes if Z flag = 0
                case "D0":
                    this.branchIfZ(code);
                    break;
                //Increment the value of a byte
                case "EE":
                    this.incremVal(code);
                    break;
                //System Call
                case "FF":
                    this.systemCall(code);
                    break;
                default:
            }
            return this.bytesNeeded;
        };
        Cpu.prototype.loadAcc = function (value) {
            this.bytesNeeded = 2;
            this.Acc = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
        };
        Cpu.prototype.loadAccFrmMem = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                //Load accumulator from memory means that we are taking the location in memory and returning the value to the Accumulator
                //Location 10 for example is the start position -10
                //FIX FIX FIX
                var numInMem = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                this.Acc = this.convToHex(_MemoryManager.fetchCurrentMemory([numInMem]));
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.strAccInMem = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var locationToStore = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                _MemoryManager.storeCurrentMemory(locationToStore, this.Acc);
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.addCarry = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var valuetoAdd = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                this.Acc = valuetoAdd + this.Acc;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.loadXregCons = function (value) {
            this.bytesNeeded = 2;
            this.Xreg = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
        };
        Cpu.prototype.loadXregMem = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var spotInMem = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                _MemoryManager.storeCurrentMemory(spotInMem, this.Xreg);
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.loadYregCons = function (value) {
            this.bytesNeeded = 2;
            this.Yreg = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
        };
        Cpu.prototype.loadYregMem = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var spotInMem = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                _MemoryManager.storeCurrentMemory(spotInMem, this.Yreg);
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.compXmem = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var spotInMem = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                this.Zflag = (this.Xreg === spotInMem) ? 1 : 0;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.branchIfZ = function (value) {
            if (this.Zflag === 0) {
                //Gets location to set the program counter to
                this.PC = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                //If we are branching to 0
                if (this.PC === 0) {
                    this.bytesNeeded = -1;
                }
                else {
                    console.log(this.PC);
                    this.bytesNeeded = (-1 * (this.PC + 1));
                }
            }
            else {
                this.bytesNeeded = 2;
            }
        };
        Cpu.prototype.incremVal = function (value) {
            this.bytesNeeded = 3;
            if (_MemoryManager.fetchCurrentMemory(value + 2).match("00")) {
                var temp = this.convToHex(_MemoryManager.fetchCurrentMemory(value + 1));
                _MemoryManager.storeCurrentMemory(value + 1, temp + 1);
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype["break"] = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(STOP_EXEC_IRQ, ["PID " + _PCB.PID + " has finished."]));
        };
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
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(STOP_EXEC_IRQ, ["Invalid system call operation, stoping execution."]));
            }
        };
        Cpu.prototype.printIntYReg = function () {
            // #$01 in X reg = print the integer stored in the Y register.
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_YREGInt_ERQ, ["Printing int from X register"]));
        };
        Cpu.prototype.printStringYReg = function () {
            // #$02 in X reg = print the 00-terminated string stored at the address in
            //  the Y register.
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_STRING, ["Printing String from Y register"]));
        };
        Cpu.prototype.returnCPU = function () {
            return [this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag];
        };
        Cpu.prototype.finsihedProg = function () {
            this.isExecuting = (this.PC < this.endOfProg) ? true : false;
        };
        Cpu.prototype.convToHex = function (value) {
            return parseInt(value.toString(), 16);
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
