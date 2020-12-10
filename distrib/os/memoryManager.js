var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.avaliableMemory = [];
            this.avaliableMemory = [true, true, true];
        }
        //LOAD MEMORY INTO SELECTED SEGMENT
        MemoryManager.prototype.loadMemory = function (usrProg, priority) {
            //Need a function that returns the current segment for use
            var segment = this.deployNextSegmentForUse();
            if (segment < 0) {
                if (_FORMATTED) {
                    segment = 9;
                    //Store program in backing store
                    _MemoryAccessor.nextProgInMem++;
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, _MemoryAccessor.nextProgInMem, usrProg]));
                    _PCB.newTask(_MemoryAccessor.nextProgInMem, 9, 99, priority);
                }
                else {
                    return -1;
                }
            }
            else {
                var index = 0;
                this.avaliableMemory[segment] = false;
                for (var i = 0; i < usrProg.length; i += 3) {
                    var code = usrProg.charAt(i) + usrProg.charAt(i + 1);
                    _MemoryAccessor.write(code, segment, index);
                    index++;
                }
                _MemoryAccessor.nextProgInMem++;
                _PCB.newTask(_MemoryAccessor.nextProgInMem, segment, index, priority);
                //Set the map from program to segment
                _MemoryAccessor.setSegtoMemMap(_MemoryAccessor.nextProgInMem, segment);
                _DeviceDisplay.startUpMemory();
            }
            //didnt error
            return _MemoryAccessor.addProcess();
        };
        MemoryManager.prototype.runMemory = function (progNumber) {
            var flag = false;
            //Checks to see if the program exists in memory
            //Includes() doesn't work :/
            var array = _MemoryAccessor.logicalMemory.slice(0);
            for (var i = 0; i < array.length; i++) {
                if (array[i] === parseInt(progNumber)) {
                    flag = true;
                }
            }
            if (flag) {
                //Put in ready queue if no duplicates
                if (_Schedular.addToReadyQueue(progNumber)) {
                    //If CPU is not executing execute
                    if (!_CPU.isExecuting) {
                        _Schedular.startCpu();
                    }
                    else {
                        _StdOut.putText("Program " + progNumber + " is already in the ready queue");
                    }
                }
                else {
                    _StdOut.putText("Could not run program.... not in memory");
                }
            }
        };
        //Checks for avaliable mem and if there is, mark it as in use
        MemoryManager.prototype.deployNextSegmentForUse = function () {
            for (var i = 0; i < 3; i++) {
                if (this.avaliableMemory[i]) {
                    return i;
                }
            }
            return -1;
        };
        MemoryManager.prototype.listProgsInMem = function () {
            var output = [];
            for (var i = 0; i < 3; i++) {
                if (!this.avaliableMemory[i]) {
                    output[i] = _MemoryAccessor.programToSegmentMap[i];
                }
            }
            return output;
        };
        //Take process off disk
        MemoryManager.prototype.rollInProcess = function (data) {
            //set prog map
            //set memory to false
            //set data to memory
            //Returns as hex
            console.log(data);
            var newSegment = this.deployNextSegmentForUse();
            console.log(newSegment);
            _Memory.clearSingleThread(newSegment);
            //update PCB
            this.avaliableMemory[newSegment] = false;
            var index = 0;
            for (var i = 0; i < _PCB.endIndex; i++) {
                var value = data.charAt(index) + data.charAt(index + 1);
                _MemoryAccessor.write(value, newSegment, i);
                index += 2;
            }
            _DeviceDisplay.cycleReload();
        };
        //Put process on disk
        MemoryManager.prototype.rollOut = function () {
            var PID = _PCB.PID;
            var data = _Memory.memoryThread[_PCB.location].slice(0);
            _KernelInputQueue.enqueue(new TSOS.Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, PID, data]));
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
