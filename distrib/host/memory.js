var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.memoryThread = [];
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
