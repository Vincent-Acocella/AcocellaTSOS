var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            //Memory has to 768
            this.memoryThread1 = [];
            this.memoryThread2 = [];
            this.memoryThread3 = [];
            this.init();
            this.endIndex = 0;
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memoryThread1[i] = "00";
                this.memoryThread2[i] = "00";
                this.memoryThread3[i] = "00";
            }
            this.endIndex = 0;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
