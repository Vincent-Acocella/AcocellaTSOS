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
            //Prolly no work
            console.log("PID being sent to display: " + PID);
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.updateSchedular(PID);
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
        return Schedular;
    }());
    TSOS.Schedular = Schedular;
})(TSOS || (TSOS = {}));
