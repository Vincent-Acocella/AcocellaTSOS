var TSOS;
(function (TSOS) {
    var hello;
    var MemoryUnit = /** @class */ (function () {
        function MemoryUnit() {
            this.memory = "1";
            this.progsInMem = 0;
            this.endIndex = 0;
            // public currentIndex():number{
            //   //  return this.memory.length()-1;
            // }
        }
        MemoryUnit.startUpMemory = function () {
        };
        MemoryUnit.addToMemory = function (code) {
            _Kernel.krnTrace(code);
        };
        return MemoryUnit;
    }());
    TSOS.MemoryUnit = MemoryUnit;
})(TSOS || (TSOS = {}));
