var TSOS;
(function (TSOS) {
    var MainMemory = /** @class */ (function () {
        function MainMemory() {
            this.memoryThread = [];
            this.currentIndex = 0;
            this.init();
        }
        MainMemory.prototype.init = function () {
            for (var i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
        };
        return MainMemory;
    }());
    TSOS.MainMemory = MainMemory;
})(TSOS || (TSOS = {}));
