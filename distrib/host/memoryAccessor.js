var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.progsInMem = 0;
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        MemoryAccessor.prototype.write = function (code, index) {
            _Memory.memoryThread[index] = code;
            _Memory.currentIndex++;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
