var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.progInMem = -1;
            this.currentSegment = 1;
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        //Edit this function 
        //important
        MemoryAccessor.prototype.write = function (code) {
            _MemoryManager.stationaryThread[_Memory.endIndex] = code;
            if (_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }
            else {
                return false;
            }
        };
        MemoryAccessor.prototype.getNextAvaliableMemSeg = function () {
            if (_Memory.memoryThread1[0] == "00") {
                return 1;
            }
            else if (_Memory.memoryThread2[0] == "00") {
                return 2;
            }
            else if (_Memory.memoryThread3[0] == "00") {
                return 3;
            }
            else {
                return -1;
            }
        };
        MemoryAccessor.prototype.segmentsInUse = function () {
            //Array of 0s and 1s 
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
