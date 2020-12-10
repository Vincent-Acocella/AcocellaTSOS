var TSOS;
(function (TSOS) {
    var Schedular = /** @class */ (function () {
        function Schedular() {
            //across
            // 0 = progNumber
            // 1 = PC
            // 2 = ACC
            // 3 = Xreg
            // 4 = YReg
            // 5 = ZReg
            // 6 = IR 
            // 7 = state
            // 8 = location
            // 9 = end of prog
            this.readyQueue = new TSOS.Queue;
            this.allProcesses = [];
            this.quant = _Quant;
        }
        Schedular.prototype.init = function () {
        };
        //--------------------------------------------------------
        //QUANT
        Schedular.prototype.setQuant = function (value) {
            _Quant = value;
            this.quant = value;
        };
        Schedular.prototype.refreshQuant = function () {
            this.quant = _Quant;
        };
        Schedular.prototype.decreaseQuantum = function () {
            this.quant--;
            console.log("Quantum now equals: " + this.quant);
        };
        //--------------------------------------------------------
        //DEPLOY PROCCESS
        //Main funtion to return the PCB back to the array
        Schedular.prototype.addProccess = function (PID) {
            this.allProcesses[PID] = _PCB.returnPCB().slice(0);
            _DeviceDisplay.startUpSchedular();
        };
        //Used to deploy to the CPU
        //Can be used after switch or initial start
        Schedular.prototype.deployFirstInQueueToCPU = function () {
            //This is the data we want
            var firstIndex = this.readyQueue.peek();
            if (_MemoryAccessor.getProgFromSegMap(firstIndex) === -1) {
                var oldPID = _PCB.PID;
                _MemoryAccessor[_PCB.location] = true;
                _MemoryAccessor.setSegtoMemMap(firstIndex, _PCB.location);
                //time to swap
                //get previous segment and deploy it to the disk
                //get last in ready queue 
                _KernelInputQueue.enqueue(new TSOS.Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, oldPID]));
                //put in location
                _KernelInputQueue.enqueue(new TSOS.Interrupt(DISKDRIVER_IRQ, [ROLLINPROG, firstIndex]));
            }
            console.log("Now Executing process:  " + firstIndex);
            this.allProcesses[firstIndex][7] = "Executing";
            var array = this.allProcesses[firstIndex];
            console.log(array);
            _PCB.loadPCB(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9]);
            _PCB.loadCPU();
            // Load PCB then put into CPU
        };
        Schedular.prototype.startCpu = function () {
            this.refreshQuant();
            this.deployFirstInQueueToCPU();
            _DeviceDisplay.startUpSchedular();
            _CPU.isComplete = false;
            _CPU.isExecuting = true;
        };
        //--------------------------------------------------------
        //SWITCH MEMORY
        Schedular.prototype.switchMemoryInterupt = function () {
            //Take PCB
            _PCB.copyCPU();
            _PCB.state = "Holding";
            this.addProccess(_PCB.PID);
            this.switchMemoryUnit();
            this.startCpu();
            _DeviceDisplay.cycleReload();
        };
        //Update ready queue
        Schedular.prototype.switchMemoryUnit = function () {
            this.readyQueue.enqueue(this.readyQueue.dequeue());
        };
        Schedular.prototype.checkIfSwitch = function () {
            if (this.quant === 1) {
                //queue up switch
                return true;
            }
            else {
                //decrease quant if there are more than 1 in ready queue
                this.decreaseQuantum();
                return false;
            }
        };
        //--------------------------------------------------------
        //READY QUEUE
        Schedular.prototype.addToReadyQueue = function (PID) {
            var added = false;
            if (!this.alreadyExistsInQueue(PID)) {
                this.readyQueue.enqueue(PID);
                _DeviceDisplay.updateReadyQueue();
                added = true;
            }
            return added;
        };
        Schedular.prototype.removeFromReadyQueue = function () {
            this.readyQueue.dequeue();
            _PCB.updateScheduler();
            _DeviceDisplay.cycleReload();
        };
        Schedular.prototype.addAllToReadyQueue = function () {
            //3 is the number of segments in memory
            var added = false;
            for (var i = 0; i < 3; i++) {
                var prog = _MemoryAccessor.programToSegmentMap[i];
                if (prog > -1) {
                    this.addToReadyQueue(prog);
                    added = true;
                }
            }
            if (added) {
                _CPU.isExecuting = true;
                this.deployFirstInQueueToCPU();
                _DeviceDisplay.updateReadyQueue();
            }
            else {
                _StdOut.putText("No more programs to execute");
            }
        };
        //UTIL
        Schedular.prototype.alreadyExistsInQueue = function (prog) {
            var flag = false;
            for (var i = 0; i < this.readyQueue.getSize(); i++) {
                var pullVal = this.readyQueue.dequeue();
                this.readyQueue.enqueue(pullVal);
                if (parseInt(pullVal) === parseInt(prog)) {
                    flag = true;
                }
            }
            return flag;
        };
        //Check if the last program is finsihed executing
        Schedular.prototype.processComplete = function () {
            this.removeFromReadyQueue();
            console.log(this.readyQueue.getSize());
            if (this.readyQueue.getSize() === 0) {
                _CPU.isExecuting = false;
            }
            else {
                this.startCpu();
            }
        };
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
