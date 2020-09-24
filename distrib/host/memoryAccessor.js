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
        //This is accounted for in memoryManager
        //Prog to index map is an array that uses its index to keep track of the coorelation from prog to endindex
        //Map is EX: [ 10, 5, 6]
        //              0  1  2
        // the 10 corresponds to the end index of the first program
        //Update the map
        // Iterates the progs in mem
        //sets the map at index of the new prog(actually 1 less in array) to the endIndex(actually ine spot in front)
        MemoryAccessor.prototype.updateMap = function (endIndex) {
            this.progsInMem++;
            this.progToIndexMap[this.progsInMem] = endIndex;
            return this.progsInMem;
        };
        //EX: prog 1 is stored in spot 0 but its progNumber is 1 so we have to back up 1 in the array
        MemoryAccessor.prototype.getMapValue = function (progNumber) {
            return this.progToIndexMap[progNumber];
        };
        //Yes Yes I know I am loading the code in backwards into the array sue me. Is it wrong maybe but Watch it work.
        //I will be preforming my next magic trick by running backwards! Probably been done before but hey. I thought it's a cool idea
        //I wanted to make a map and work off that but this was done in about 10 lines of code so like. Better?
        MemoryAccessor.prototype.write = function (code) {
            _Memory.memoryThread.push(code);
            if (_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }
            else {
                return false;
            }
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
