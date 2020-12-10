var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        // 0 = progNumber
        // 1 = PC
        // 2 = IR
        // 3 = ACC
        // 4 = Xreg
        // 5 = YReg
        // 6 = ZReg
        // 7 = state
        // 8 = location
        // 9 = end of prog
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, IR, state, location, locationState, Zflag, timeAdded, priority, endIndex) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (IR === void 0) { IR = "x"; }
            if (state === void 0) { state = ""; }
            if (location === void 0) { location = -1; }
            if (locationState === void 0) { locationState = ""; }
            if (Zflag === void 0) { Zflag = 0; }
            if (timeAdded === void 0) { timeAdded = 0; }
            if (priority === void 0) { priority = 0; }
            if (endIndex === void 0) { endIndex = 0; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.IR = IR;
            this.state = state;
            this.location = location;
            this.locationState = locationState;
            this.Zflag = Zflag;
            this.timeAdded = timeAdded;
            this.priority = priority;
            this.endIndex = endIndex;
        }
        ProcessControlBlock.prototype.init = function () {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "x";
            this.locationState = "";
            this.state = "Unknown";
            this.location = -1;
            this.Zflag = 0;
            this.timeAdded = 0;
            this.priority = 0;
            this.endIndex = 0;
        };
        ProcessControlBlock.prototype.newTask = function (PID, segment, index) {
            //We need to save the state of the PCB in case it is being used
            var tempPCB = this.returnPCB();
            this.init();
            var tempPID = parseInt(PID);
            this.PID = tempPID;
            this.location = segment;
            if (this.location > 2) {
                this.locationState = "Disk";
            }
            else {
                this.locationState = "Memory";
            }
            this.endIndex = index;
            this.state = "ready";
            _Schedular.addProccess(PID);
            this.loadPCB(tempPCB[0], tempPCB[1], tempPCB[2], tempPCB[3], tempPCB[4], tempPCB[5], tempPCB[6], tempPCB[7], tempPCB[8], tempPCB[9]);
        };
        ProcessControlBlock.prototype.terminateCPU = function () {
            this.state = "terminated";
            //_MemoryAccessor.programOverCleanUp(this.location);
            //this.location = -1;
            _Schedular.processComplete();
        };
        ProcessControlBlock.prototype.loadPCB = function (PID, PC, ACC, X, Y, Z, IR, state, loc, end) {
            this.PID = PID;
            this.PC = PC;
            this.Acc = ACC;
            this.Xreg = X;
            this.Yreg = Y;
            this.Zflag = Z;
            this.IR = IR;
            this.state = state;
            this.location = loc;
            this.endIndex = end;
        };
        ProcessControlBlock.prototype.copyCPU = function () {
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Xreg = _CPU.Xreg;
            this.location = _CPU.segment;
            this.IR = _CPU.IR;
            this.Acc = _CPU.Acc;
            this.endIndex = _CPU.endOfProg;
            this.Yreg = _CPU.Yreg;
        };
        ProcessControlBlock.prototype.updateScheduler = function () {
            this.copyCPU();
            _Schedular.addProccess(this.PID);
        };
        ProcessControlBlock.prototype.loadCPU = function () {
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Acc = this.Acc;
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
            _CPU.IR = this.IR;
            _CPU.segment = this.location;
            _CPU.endOfProg = this.endIndex;
        };
        ProcessControlBlock.prototype.returnPCB = function () {
            return [this.PID, this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.IR, this.state, this.location, this.endIndex];
        };
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
