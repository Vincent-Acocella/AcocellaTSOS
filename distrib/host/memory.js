var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory() {
            this.memorySegment0 = [];
            this.memorySegment1 = [];
            this.memorySegment2 = [];
            this.memoryThread = [];
            this.memorySegment0 = [];
            this.memorySegment1 = [];
            this.memorySegment2 = [];
            this.memoryThread = [];
            this.init();
        }
        //Clear a signle thread of memory when complete or terminated
        Memory.prototype.clearSingleThread = function (segment) {
            for (var i = 0; i < 256; i++) {
                this.memoryThread[segment][i] = "00";
            }
        };
        Memory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memorySegment0[i] = "00";
                this.memorySegment1[i] = "00";
                this.memorySegment2[i] = "00";
            }
            this.memoryThread = [this.memorySegment0, this.memorySegment1, this.memorySegment2];
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
