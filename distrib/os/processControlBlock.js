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
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, IR, state, location, Zflag, endIndex) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (IR === void 0) { IR = "x"; }
            if (state === void 0) { state = ""; }
            if (location === void 0) { location = -1; }
            if (Zflag === void 0) { Zflag = 0; }
            if (endIndex === void 0) { endIndex = 0; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.IR = IR;
            this.state = state;
            this.location = location;
            this.Zflag = Zflag;
            this.endIndex = endIndex;
        }
        ProcessControlBlock.prototype.init = function () {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "x";
            this.state = "Unknown";
            this.location = -1;
            this.Zflag = 0;
            this.endIndex = 0;
        };
        ProcessControlBlock.prototype.newTask = function (PID, segment, index) {
            var tempPID = parseInt(PID);
            this.PID = tempPID;
            this.location = segment;
            this.endIndex = index;
            this.state = "ready";
            _Schedular.addProccess(PID);
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
        ProcessControlBlock.prototype.loadCPU = function () {
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
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
