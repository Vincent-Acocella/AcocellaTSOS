var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.stationaryThread = [];
        }
        //Load input into memory.
        MemoryManager.prototype.loadMemory = function (usrProg) {
            //Check which memory unit is availiable
            var segNum = _MemoryAccessor.getNextAvaliableMemSeg();
            console.log("Segment Number to input into --" + segNum);
            _Memory.endIndex = 0;
            //Write memory into desired segment
            if (segNum > 0) {
                _MemoryAccessor.progInMem++;
                var newProg = _MemoryAccessor.progInMem;
                for (var i = 0; i < usrProg.length; i += 3) {
                    //Concats opcode
                    var code = usrProg.charAt(i) + usrProg.charAt(i + 1);
                    if (!_MemoryAccessor.write(code)) {
                        break;
                    }
                }
                switch (segNum) {
                    case 1:
                        _Memory.memoryThread1 = this.stationaryThread.splice(0);
                        break;
                    case 2:
                        _Memory.memoryThread2 = this.stationaryThread.splice(0);
                        break;
                    case 3:
                        _Memory.memoryThread3 = this.stationaryThread.splice(0);
                        break;
                    default:
                }
                this.stationaryThread = [];
                //console.log(this.stationaryThread[0] + _Memory.endIndex)
                return newProg;
            }
            else {
                _StdOut.putText("NO AVALIABLE MEMORY");
                return -1;
            }
        };
        //The array keeps track of the past values uses the prev index as ref
        MemoryManager.prototype.runMemory = function (progNumber) {
            //get the map value
            if (progNumber <= _MemoryAccessor.progInMem) {
                _PCB.newTask(progNumber);
            }
        };
        MemoryManager.prototype.runAllMemory = function () {
            _RoundRobin = true;
            var size = _MemoryAccessor.progInMem;
            //Add all to Schedular 
            for (var i = 0; i < size; i++) {
                this.runMemory(i);
            }
            //Look at the first segment and load it in the cpu
            _Schedular.deployToCPU(_Schedular.progToSegMap(1));
            if (!_SingleStep) {
                _CPU.isExecuting = true;
            }
            else {
                _StdOut.putText("Single Step is Enabled!");
            }
        };
        MemoryManager.prototype.fetchCurrentMemory = function (index) {
            switch (_MemoryAccessor.currentSegment) {
                case 1:
                    return _Memory.memoryThread1[index];
                case 2:
                    return _Memory.memoryThread2[index];
                case 3:
                    return _Memory.memoryThread3[index];
            }
        };
        MemoryManager.prototype.storeCurrentMemory = function (index, val) {
            switch (_MemoryAccessor.currentSegment) {
                case 1:
                    _Memory.memoryThread1[index] = val;
                    break;
                case 2:
                    _Memory.memoryThread2[index] = val;
                    break;
                case 3:
                    _Memory.memoryThread3[index] = val;
                    break;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
