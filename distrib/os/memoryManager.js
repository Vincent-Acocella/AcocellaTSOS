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
            if (segment < 0) {
                return -1;
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
            var segment = _MemoryAccessor.getProgFromSegMap(parseInt(progNumber));
            if (segment < 0) {
            }
            progNumber();
            // if(progNumber <= _MemoryAccessor.progInMem){
            //     _PCB.newTask(progNumber);
            //     _CPU.isExecuting = true;
            // }
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
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
