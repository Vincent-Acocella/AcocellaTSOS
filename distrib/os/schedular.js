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
            this.readyQueue = [];
            this.readyPointer = -1;
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
            if (this.readyQueue[this.readyPointer]) {
                //Gets PID of next segment
                //Switch process
                _PCB.state = "Waiting";
                this.deployToCPU();
            }
            else {
                //Done
            }
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        };
        Schedular.prototype.addToProcessScheduler = function () {
            this.singleProcess = _PCB.returnPCB();
            var PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
            console.log(this.allProcesses[PID].toString());
            this.readyQueue[this.readyPointer + 1] = PID;
            _DeviceDisplay.updateSchedular();
        };
        Schedular.prototype.deployToCPU = function () {
            var PID = this.readyQueue[this.readyPointer];
            this.allProcesses[PID][8] = "Executing";
            _DeviceDisplay.updateSchedular();
            _CPU.loadCPU(this.allProcesses[PID][1], this.allProcesses[PID][2], this.allProcesses[PID][3], this.allProcesses[PID][4], this.allProcesses[PID][5], this.allProcesses[PID][6], this.allProcesses[PID][7]);
        };
        Schedular.prototype.checkIfSwitch = function () {
            if (_Schedular.quant === 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }
            else {
                //killed
                _Schedular.quant--;
                //Decrease the quant means we are staying in the same process
            }
        };
        Schedular.prototype.programEnded = function (PID) {
            this.allProcesses[PID][8] = "Terminated";
            this.allProcesses[PID][9] = 0;
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
        Schedular.prototype.terminateCurrentProcess = function () {
            this.allProcesses[this.readyQueue[0]][8] = "Terminated";
            if (this.readyQueue[1]) {
                this.readyQueue[0] = this.readyQueue[1];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }
        };
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
