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
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.startUpSchedular();
        };
        //Used to deploy to the CPU
        //Can be used after switch or initial start
        Schedular.prototype.deployFirstInQueueToCPU = function () {
            //This is the data we want
            var firstIndex = this.readyQueue.peek();
            this.allProcesses[firstIndex][7] = "Executing";
            var array = this.allProcesses[firstIndex];
            _PCB.loadPCB(array[0], array[1], array[2], array[3], array[4], array[5], array[6], array[7], array[8], array[9]);
            _PCB.loadCPU();
            // Load PCB then put into CPU
        };
        Schedular.prototype.startCpu = function () {
            this.deployFirstInQueueToCPU();
            _CPU.isExecuting = true;
        };
        //--------------------------------------------------------
        //SWITCH MEMORY
        Schedular.prototype.switchMemoryInterupt = function () {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(MEM_SWAP, ["Switching Memory"]));
        };
        //Update ready queue
        Schedular.prototype.switchMemoryUnit = function () {
            this.readyQueue.enqueue(this.readyQueue.dequeue());
            console.log("Switching ready queue");
        };
        Schedular.prototype.checkIfSwitch = function () {
            //If the ready queue is empty but the quant is not 0, it was killed so check for both
            return (this.quant === 0 || this.readyQueue.isEmpty());
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
            _DeviceDisplay.updateReadyQueue();
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
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
