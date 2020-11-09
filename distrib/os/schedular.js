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
            // 9 =  end of prog
            this.readyQueue = new TSOS.Queue;
            this.allProcesses = [];
            this.quant = _Quant;
        }
        Schedular.prototype.init = function () {
        };
        Schedular.prototype.addProccess = function (PID) {
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.startUpSchedular();
        };
        Schedular.prototype.deployToPCB = function (PID) {
            this.allProcesses[PID];
        };
        Schedular.prototype.setQuant = function (value) {
            _Quant = value;
            this.quant = value;
        };
        Schedular.prototype.refreshQuant = function () {
            this.quant = _Quant;
        };
        //Update ready queue
        Schedular.prototype.switchMemoryUnit = function () {
            this.readyQueue.enqueue(this.readyQueue.dequeue());
            console.log("Switching ready queue");
        };
        Schedular.prototype.addToReadyQueue = function (PID) {
            var added = false;
            if (!this.alreadyExistsInQueue(PID)) {
                this.readyQueue.enqueue(PID);
                _DeviceDisplay.updateReadyQueue();
                added = true;
            }
            return added;
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
                _DeviceDisplay.updateReadyQueue();
            }
            else {
                _StdOut.putText("No more programs to execute");
            }
        };
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
        Schedular.prototype.checkIfSwitch = function () {
            if (this.quant === 0) {
                return true;
            }
            else {
                this.decreaseQuantum();
                return false;
            }
        };
        Schedular.prototype.decreaseQuantum = function () {
            this.quant--;
            console.log("Quantum now equals: " + this.quant);
        };
        Schedular.prototype.switchMemory = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        };
        Schedular.prototype.deployFirstInQueueToCPU = function () {
            //This is the data we want
            var firstIndex = this.readyQueue.peek();
            this.allProcesses[firstIndex][7] = "Executing";
            var array = this.allProcesses[firstIndex];
            _PCB.loadPCB(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9]);
            _PCB.loadCPU();
            // Load PCB then put into CPU
            console.log("Array that is being deployed is: " + array);
        };
        Schedular.prototype.startCpu = function () {
            this.deployFirstInQueueToCPU();
            _CPU.isExecuting = true;
        };
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
