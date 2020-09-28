var TSOS;
(function (TSOS) {
    var ProcessControlBlock = /** @class */ (function () {
        function ProcessControlBlock(PID, PC, Acc, Xreg, Yreg, IR, state, location, Zflag) {
            if (PID === void 0) { PID = 0; }
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (IR === void 0) { IR = ""; }
            if (state === void 0) { state = 0; }
            if (location === void 0) { location = "memory"; }
            if (Zflag === void 0) { Zflag = 0; }
            this.PID = PID;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.IR = IR;
            this.state = state;
            this.location = location;
            this.Zflag = Zflag;
        }
        ProcessControlBlock.prototype.init = function () {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "";
            this.state = 0;
            this.location = "memory";
            this.Zflag = 0;
        };
        ProcessControlBlock.prototype.newTask = function (PID) {
            this.PID = parseInt(PID);
            this.PC = _MemoryAccessor.getMapValue(this.PID);
            this.load();
        };
        //State 0 is idle
        //1 is running
        //2 is holding
        //3 Complete (Done) Back to 1 and clear
        ProcessControlBlock.prototype.save = function () {
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Yreg = _CPU.Yreg;
            this.Xreg = _CPU.Xreg;
            this.IR = _CPU.IR;
            this.state = 2;
        };
        ProcessControlBlock.prototype.load = function () {
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
            _CPU.IR = this.IR;
            this.state = 1;
        };
        ProcessControlBlock.prototype.returnPCB = function () {
            return [this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location];
        };
        return ProcessControlBlock;
    }());
    TSOS.ProcessControlBlock = ProcessControlBlock;
})(TSOS || (TSOS = {}));
