var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.memoryThread = [];
            this.memoryThread = [];
            this.progsInMem = 0;
            this.currentIndex = 0;
            this.init();
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
