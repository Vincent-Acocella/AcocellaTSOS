var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.progsInMem = 0;
            this.progToIndexMap = [];
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        //The array will be a map the index will be 1 infront of the stored index
        MemoryAccessor.prototype.updateMap = function (endIndex) {
            this.progsInMem++;
            this.progToIndexMap[this.progsInMem] = endIndex;
            return this.progsInMem;
        };
        //Yes Yes I know I am loading the code in backwards into the array sue me. Is it wrong maybe but Watch it work.
        //I will be preforming my next magic trick by running backwards! Probably been done before but hey. I thought it's a cool idea
        //I wanted to make a map and work off that but this was done in about 10 lines of code so like. Better?
        MemoryAccessor.prototype.write = function (code) {
            _Memory.memoryThread.push(code);
            _Memory.endIndex++;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
