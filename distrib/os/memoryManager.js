var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.avaliableMemory = [];
            this.currentMemorySegment = 0;
            this.avaliableMemory = [true, true, true];
        }
        //LOAD MEMORY INTO SELECTED SEGMENT
        MemoryManager.prototype.loadMemory = function (usrProg) {
            //Need a function that returns the current segment for use
            var segment = this.deployNextSegmentForUse();
            console.log(segment);
            if (segment < 1) {
                if (_FORMATTED) {
                    console.log("here");
                    //Store program in backing store
                    console.log(usrProg);
                    _DeviceDiskDriver.writeProgramToDisk(usrProg);
                    //Create format for file names
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
                _PCB.newTask(_MemoryAccessor.nextProgInMem, segment, index);
                //Set the map from program to segment
                _MemoryAccessor.setSegtoMemMap(_MemoryAccessor.nextProgInMem, segment);
                _DeviceDisplay.startUpMemory();
                return _MemoryAccessor.nextProgInMem;
            }
        };
        MemoryManager.prototype.runMemory = function (progNumber) {
            var segment = _MemoryAccessor.getProgFromSegMap(progNumber);
            //Checks to see if the program exists in memory
            if (segment < 0) {
                _StdOut.putText("Could not run program.... not in memory");
            }
            else {
                //Put in ready queue if no duplicates
                if (_Schedular.addToReadyQueue(progNumber)) {
                    //If CPU is not executing execute
                    if (!_CPU.isExecuting) {
                        _Schedular.deployFirstInQueueToCPU();
                        _Schedular.startCpu();
                    }
                }
                else {
                    _StdOut.putText("Program " + progNumber + " is already in the ready queue");
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
        MemoryManager.prototype.rollIn = function () {
        };
        //Put process on disk
        MemoryManager.prototype.rollOut = function () {
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
