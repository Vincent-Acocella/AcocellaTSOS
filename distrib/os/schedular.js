var TSOS;
(function (TSOS) {
    var Schedular = /** @class */ (function () {
        function Schedular(
        //line Up Process id with index of all processes
        //Single process is just a PCB
        ) {
            //across
            // 0 = progNumber
            // 1 = PC
            // 2 = ACC
            // 3 = Xreg
            // 4 = YReg
            // 5 = ZReg
            // 6 = IR
            // 8 = state
            // 9 = location
            this.singleProcess = [];
            this.allProcesses = [[], []];
            this.quant = 6;
            this.segInUse = [];
            this.processesInSchedular = 0;
        }
        Schedular.prototype.setQuant = function (value) {
            _Quant = value;
            this.quant = value;
        };
        Schedular.prototype.refreshQuant = function () {
            this.quant = _Quant;
        };
        Schedular.prototype.switchMem = function () {
            //get current segment
            //Go to the next segment 
            this.refreshQuant();
            var lookAt = 1;
            //Account for empty segment
            switch (_MemoryAccessor.currentSegment) {
                case 1:
                    lookAt = 2;
                    break;
                case 2:
                    lookAt = 3;
                    break;
            }
            _MemoryAccessor.currentSegment = lookAt;
            //Gets PID of next segment
            //Switch process
            _PCB.state = "Waiting";
            this.deployToCPU(this.progToSegMap(lookAt));
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        };
        Schedular.prototype.addToProcessScheduler = function () {
            //Check this line
            this.singleProcess = _PCB.returnPCB();
            var PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
            console.log(this.allProcesses[PID].toString());
        };
        Schedular.prototype.deployToCPU = function (PID) {
            this.addToProcessScheduler();
            this.allProcesses[PID][8] = "Executing";
            for (var i = 1; i < 6; i++) {
                this.singleProcess[i] = this.allProcesses[PID][i];
            }
            _PCB.PID = PID;
            _CPU.loadCPU(this.allProcesses[PID][1], this.allProcesses[PID][2], this.allProcesses[PID][3], this.allProcesses[PID][4], this.allProcesses[PID][5], this.allProcesses[PID][6], this.allProcesses[PID][7]);
        };
        Schedular.prototype.checkIfSwitch = function () {
            if (_Schedular.quant !== 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }
            else {
                //Decrease the quant means we are staying in the same process
                _Schedular.quant--;
            }
        };
        Schedular.prototype.checkSegmentIsInUse = function (PID) {
            //Where it's located
            //true if used
            return _MemoryAccessor.segsInUse[this.allProcesses[PID][9]];
        };
        Schedular.prototype.progToSegMap = function (lookAt) {
            var i = 0;
            for (i; i <= _MemoryAccessor.progInMem; i++) {
                if (this.allProcesses[i][9] === lookAt) {
                    return i;
                }
            }
            return -1;
        };
        Schedular.prototype.programEnded = function (PID) {
            this.allProcesses[PID][8] = "Terminated";
            _MemoryAccessor.segmentsInUseSwitch(this.allProcesses[PID][9]);
        };
        Schedular.prototype.kill = function (PID) {
            this.allProcesses[PID][8] = "Terminated";
        };
        Schedular.prototype.killAll = function () {
            for (var i = 0; i < this.processesInSchedular; i++) {
                this.kill(i);
            }
        };
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
