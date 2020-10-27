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
            // 2 = IR
            // 3 = ACC
            // 4 = Xreg
            // 5 = YReg
            // 6 = ZReg
            // 7 = state
            // 8 = location
            // 9 =  end of prog
            //this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location, this.endOfProg
            this.singleProcess = [];
            this.allProcesses = [[], []];
            this.quant = 6;
            this.segInUse = [];
            this.processesInSchedular = 0;
            this.readyQueue = [];
        }
        Schedular.prototype.setQuant = function (value) {
            _Quant = value;
            this.quant = value;
        };
        Schedular.prototype.refreshQuant = function () {
            this.quant = _Quant;
        };
        Schedular.prototype.switchMem = function () {
            if (this.readyQueue.length > 0) {
                this.queueReadyQueue(this.dequeueReadyQueue());
                this.refreshQuant();
                //Gets PID of next segment
                //Switch process
                _PCB.state = "Waiting";
                this.deployToCPU();
            }
            else {
                _StdOut.putText("All processes Complete");
                _CPU.isExecuting = false;
            }
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        };
        Schedular.prototype.addToProcessScheduler = function () {
            this.processesInSchedular++;
            this.singleProcess = _PCB.returnPCB().splice(0);
            var PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
            //Adds to ready queue
            this.queueReadyQueue(PID);
            _DeviceDisplay.updateSchedular(PID);
        };
        Schedular.prototype.deployToCPU = function () {
            var PID = this.readyQueue[0];
            this.allProcesses[PID][8] = "Executing";
            _DeviceDisplay.updateSchedular();
            _CPU.loadCPU(this.allProcesses[PID][1], this.allProcesses[PID][2], this.allProcesses[PID][3], this.allProcesses[PID][4], this.allProcesses[PID][5], this.allProcesses[PID][6], this.allProcesses[PID][7], this.allProcesses[PID][9]);
            _DeviceDisplay.updateSchedular(PID);
        };
        Schedular.prototype.checkIfSwitch = function () {
            if (_Schedular.quant === 0) {
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }
            else {
                _Schedular.quant--;
            }
        };
        Schedular.prototype.programEnded = function (PID) {
            this.allProcesses[PID][8] = "Terminated";
            this.allProcesses[PID][9] = 0;
            _MemoryAccessor.segmentsInUseSwitch(this.allProcesses[PID][9]);
        };
        Schedular.prototype.kill = function (PID) {
            var flag = false;
            var i = 0;
            while (i < this.readyQueue.length && !flag) {
                var temp = this.dequeueReadyQueue();
                if (PID === temp) {
                    flag = true;
                }
                else {
                    this.queueReadyQueue(temp);
                    i++;
                }
            }
            //Put it back into order
            for (var j = 0; j < i; j++) {
                this.queueReadyQueue(this.dequeueReadyQueue());
            }
            this.allProcesses[PID][8] = "Terminated";
        };
        Schedular.prototype.killAll = function () {
            for (var i = 0; i < this.readyQueue.length; i++) {
                this.allProcesses[this.readyQueue[i]][8] = "terminated";
                this.dequeueReadyQueue();
            }
        };
        Schedular.prototype.queueReadyQueue = function (value) {
            this.readyQueue.push(value);
        };
        Schedular.prototype.dequeueReadyQueue = function () {
            var retVal = null;
            if (this.readyQueue.length > 0) {
                retVal = this.readyQueue.shift();
            }
            return retVal;
        };
        Schedular.prototype.terminateCurrentProcess = function () {
            this.allProcesses[this.readyQueue[0]][8] = "Complete";
            this.dequeueReadyQueue();
            _DeviceDisplay[this.dequeueReadyQueue()];
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        };
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
