var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.memoryThread = [];
            this.memoryThread = [];
            this.endIndex = 0;
            this.init();
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
            this.endIndex = 0;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
