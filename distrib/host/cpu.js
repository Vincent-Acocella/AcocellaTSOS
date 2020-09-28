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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, IR, endOfProg, bytesNeeded, 
        //public PCB = _PCB,
        isExecuting) {
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
            //this.PCB = null;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _DeviceDisplay.updateCPU();
            _DeviceDisplay.updatePCB();
            _PCB.state = 1;
            _Kernel.krnTrace('CPU cycle');
            var moveThatBus = this.fetch(_Memory.memoryThread[this.PC]);
            if (moveThatBus < 0) {
                //Time to branch
                this.PC = (-moveThatBus) - 1;
            }
            else {
                //Increment by bytes
                this.PC += moveThatBus;
            }
            if (this.PC < this.endOfProg) {
                this.isExecuting = false;
                _PCB.state = 3;
            }
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        };
        Cpu.prototype.fetch = function (code) {
            var opCode = _Memory.memoryThread[code];
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
                    break;
                //compare a byte in memory to the X reg. sets Z flag if =
                case "EC":
                    this.compXmem(code);
                    break;
                //Branch n bytes if Z flag =0
                case "D0":
                    this.branchIfZ(code);
                    break;
                //Increment the value of a byte
                case "EE":
                    this.incremVal(code);
                    break;
                //System Call
                case "FF":
                    break;
                default:
            }
            this.PC++;
            return this.bytesNeeded;
        };
        Cpu.prototype.loadAcc = function (value) {
            this.bytesNeeded = 3;
            this.Acc = _Memory.memoryThread[value + 1];
        };
        Cpu.prototype.loadAccFrmMem = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                //Load accumulator from memory means that we are taking the location in memory and returning the value to the Accumulator
                //Location 10 for example is the start position -10
                //FIX FIX FIX
                var numInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Acc = _Memory.memoryThread[numInMem];
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.strAccInMem = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var locationToStore = parseInt(_Memory.memoryThread[value + 1]);
                _Memory.memoryThread[locationToStore] = this.Acc;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.addCarry = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var valuetoAdd = parseInt(_Memory.memoryThread[value + 1]);
                this.Acc = valuetoAdd + this.Acc;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.loadXregCons = function (value) {
            this.bytesNeeded = 2;
            this.Xreg = parseInt(_Memory.memoryThread[value + 1]);
        };
        Cpu.prototype.loadXregMem = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Xreg = _Memory.memoryThread[spotInMem];
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.loadYregCons = function (value) {
            this.bytesNeeded = 2;
            this.Yreg = parseInt(_Memory.memoryThread[value + 1]);
        };
        Cpu.prototype.loadYregMem = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Yreg = _Memory.memoryThread[spotInMem];
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.compXmem = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Zflag = (this.Xreg === spotInMem) ? 1 : 0;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.branchIfZ = function (value) {
            if (this.Zflag === 0) {
                this.PC = parseInt(_Memory.memoryThread[value + 1]);
                if (this.PC === 0) {
                    this.bytesNeeded = -1;
                }
                else {
                    //Do this to account for a branch to 0
                    this.bytesNeeded = -(this.PC + 1);
                }
            }
            else {
                this.bytesNeeded = 3;
            }
        };
        Cpu.prototype.incremVal = function (value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                var temp = parseInt(_Memory.memoryThread[value + 1]);
                _Memory.memoryThread[value + 1] = temp + 1;
            }
            else {
                _StdOut.putText("Only one memory segment exists currently");
            }
        };
        Cpu.prototype.returnCPU = function () {
            return [this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag];
        };
        Cpu.prototype.finsihedProg = function () {
            this.isExecuting = (this.PC < this.endOfProg) ? true : false;
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
