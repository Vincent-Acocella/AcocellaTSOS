var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.progInMem = -1;
            this.currentSegment = 1;
            this.segsInUse = [false, false, false];
            this.endOfProgMap = [256, 256, 256];
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
        MemoryAccessor.prototype.segmentsInUseSwitch = function (seg) {
            this.segsInUse[seg] = !this.segsInUse[seg];
            //Array of 0s and 1s 
        };
        MemoryAccessor.prototype.setSegmentToEndOfProg = function (seg, value) {
            console.log("Setting the Segment: " + seg + "To the value of : " + value);
            this.endOfProgMap[seg - 1] = value;
        };
        //1 seg is stored in 0
        MemoryAccessor.prototype.getSegmentToEndOfProg = function (seg) {
            console.log("Returning the value: " + this.endOfProgMap[seg - 1] + "for the Segment: " + seg);
            return this.endOfProgMap[seg - 1];
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
