var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.nextProgInMem = -1;
            this.programToSegmentMap = [];
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        //Write from pysical memory to logical
        MemoryAccessor.prototype.write = function (code, segement, index) {
            //console.log("AT Segment: " + segement + " and index " + index + " ====" + code);
            _Memory.memoryThread[segement][index] = code;
            //Chnage for single entry?
            // _DeviceDisplay.updateMemory();
        };
        MemoryAccessor.prototype.read = function (curIndex, segment) {
            return _Memory.memoryThread[segment][curIndex];
        };
        //input the segment and program number
        MemoryAccessor.prototype.setSegtoMemMap = function (progNumber, segment) {
            this.programToSegmentMap[segment] = progNumber;
        };
        //Returns segment from progNumber
        MemoryAccessor.prototype.getProgFromSegMap = function (progNumber) {
            for (var i = 0; i < 3; i++) {
                if (this.programToSegmentMap[i] === parseInt(progNumber)) {
                    return i;
                }
            }
            return -1;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
