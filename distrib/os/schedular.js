var TSOS;
(function (TSOS) {
    var Schedular = /** @class */ (function () {
        function Schedular() {
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
            if (!this.alreadyExistsInQueue(PID)) {
                this.readyQueue.enqueue(PID);
                //_CPU.isExecuting = true;
                _DeviceDisplay.updateReadyQueue();
            }
            else {
                _StdOut.putText("Program " + PID + " is already in the ready queue");
            }
        };
        Schedular.prototype.addAllToReadyQueue = function () {
            //3 is the number of segments in memory
            for (var i = 0; i < 3; i++) {
                var prog = _MemoryAccessor.programToSegmentMap[i];
                if (prog > -1) {
                    if (!this.alreadyExistsInQueue(prog)) {
                        this.readyQueue.enqueue(prog);
                    }
                    else {
                        _StdOut.putText("Program " + i + " is already in the ready queue");
                    }
                }
            }
            if (this.readyQueue.getSize() > 0) {
                _CPU.isExecuting = true;
                _DeviceDisplay.updateReadyQueue();
            }
            else {
                _StdOut.putText("No programs to execute");
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
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
