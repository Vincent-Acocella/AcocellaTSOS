var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.progInMem = -1;
            this.currentSegment = 1;
            this.segsInUse = [false, false, false];
            this.progToSegMap = [-1, -1, -1];
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
            if (!this.segsInUse[0]) {
                this.segsInUse[0] = true;
                console.log("SEGMENT SHOULD BE EQUAL TO 1");
                return 1;
            }
            else if (!this.segsInUse[1]) {
                this.segsInUse[1] = true;
                console.log("SEGMENT SHOULD BE EQUAL TO 2");
                return 2;
            }
            else if (!this.segsInUse[2]) {
                console.log("SEGMENT SHOULD BE EQUAL TO 3");
                this.segsInUse[2] = true;
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
        MemoryAccessor.prototype.foundInSegment = function (prog) {
            for (var i = 0; i < this.progToSegMap.length; i++) {
                if (this.progToSegMap[i] = prog) {
                    return i + 1;
                }
            }
            return -1;
            ;
        };
        MemoryAccessor.prototype.iterateProgsInMem = function () {
            this.progInMem++;
            console.log("Prog is iterated to: " + this.progInMem);
            return this.progInMem;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
