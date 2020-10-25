var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, Zflag, IR, endOfProg, state, location) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (IR === void 0) { IR = ""; }
            if (endOfProg === void 0) { endOfProg = 0; }
            if (state === void 0) { state = "none"; }
            if (location === void 0) { location = 0; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.IR = IR;
            this.endOfProg = endOfProg;
            this.state = state;
            this.location = location;
        }
        ProcessControlBlock.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "";
            this.state = "";
            this.location = 0;
            this.Zflag = 0;
        };
        ProcessControlBlock.prototype.newTask = function (PID) {
            this.init();
            this.PID = parseInt(PID);
            if (!_RoundRobin) {
                this.loadToCPU();
                if (!_SingleStep) {
                    _CPU.isExecuting = true;
                }
                else {
                    _StdOut.putText("Single Step is Enabled!");
                }
            }
            else {
                _Schedular.addToProcessScheduler();
            }
            //Instead of load we add to schudluer      
        };
        //State 0 is idle
        //1 is running
        //2 is holding
        //3 Complete (Done) Back to 1 and clear
        //Add to 
        ProcessControlBlock.prototype.updatePCB = function () {
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Yreg = _CPU.Yreg;
            this.Xreg = _CPU.Xreg;
            this.IR = _CPU.IR;
            this.endOfProg = _CPU.endOfProg;
        };
        //Load to cpu
        ProcessControlBlock.prototype.loadToCPU = function () {
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
        };
        ProcessControlBlock.prototype.returnPCB = function () {
            return [this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location];
        };
        ProcessControlBlock.prototype.addToPCB = function (PID, PC, Zflag, Yreg, Xreg, IR) {
            this.PID = PID;
            this.PC = PC;
            this.Zflag = Zflag;
            this.Yreg = Yreg;
            this.Xreg = Xreg;
            this.IR = IR;
            this.state = "running";
        };
        ProcessControlBlock.prototype.terminate = function () {
            _CPU.isExecuting = false;
            if (_StdOut.currentXPosition > 0) {
                _StdOut.clearCmdLine("");
            }
            _Memory.init();
            _DeviceDisplay = new TSOS.DeviceDisplay();
            _PCB.init();
            // _PCB.load();
            _MemoryAccessor.progInMem = -1;
        };
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
