var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //Load input into memory. It is in backwards
        MemoryManager.prototype.loadMemory = function (usrProg) {
            for (var i = 0; i < usrProg.length; i += 2) {
                var code = usrProg.substr(i, i + 1);
                _MemoryAccessor.write(code);
            }
            var progsInMem = _MemoryAccessor.updateMap(_Memory.endIndex);
            return progsInMem;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
