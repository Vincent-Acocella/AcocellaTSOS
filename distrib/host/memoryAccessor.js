var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.nextProgInMem = -1;
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        //Write from pysical memory to logical
        MemoryAccessor.prototype.write = function (code, segement, index) {
            console.log("AT Segment: " + segement + " and index " + index + " ====" + code);
            _Memory.memoryThread[segement][index] = code;
            //Chnage for single entry?
            _DeviceDisplay.updateMemory();
        };
        MemoryAccessor.prototype.read = function (curIndex, segment) {
            return _Memory.memoryThread[segment][curIndex];
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
