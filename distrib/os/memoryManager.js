var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        MemoryManager.prototype.loadMemory = function (usrProg) {
            // var curIndex = 0;
            var val = usrProg + "";
            _Kernel.krnTrace(val);
            for (var i = 0; i < 10; i += 2) {
                var code = usrProg.substr(i, i + 1);
                _MemoryAccessor.write(code, i + _Memory.currentIndex);
            }
            _Memory.progsInMem++;
            console.log(_Memory.progsInMem);
            return _Memory.progsInMem;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
