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
        //Prog to index map is an array that uses its index to keep track of the coorelation from prog to startindex
        //Map is EX: [ 10, 5, 6]
        //              0  1  2
        // the 10 corresponds to the start index of the first program
        //Update the map
        // Iterates the progs in mem
        MemoryAccessor.prototype.updateMap = function (startIndex) {
            this.progsInMem++;
            this.progToIndexMap[this.progsInMem] = startIndex;
            return this.progsInMem;
        };
        MemoryAccessor.prototype.getMapValue = function (progNumber) {
            return this.progToIndexMap[progNumber];
        };
        //Yes Yes I know I am loading the code in backwards into the array sue me. Is it wrong maybe but Watch it work.
        //I will be preforming my next magic trick by running backwards! Probably been done before but hey. I thought it's a cool idea
        //I wanted to make a map and work off that but this was done in about 10 lines of code so like. Better?
        //----------------------------------------------------------------------
        //Ahhhhh I was so young and ignorant. Why did I have that much confidence and then was wrong.
        MemoryAccessor.prototype.write = function (code) {
            _Memory.memoryThread[_Memory.endIndex] = code;
            if (_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }
            else {
                return false;
            }
        };
        //Read grabs the current input from memory and loops through it while running the opcode.
        MemoryAccessor.prototype.read = function (startIndex, endIndex) {
            while (startIndex < endIndex) {
                _CPU.isExecuting;
                var moveThatBus = _CPU.fetch(startIndex);
                if (moveThatBus < 0) {
                    //Time to branch
                    startIndex = (-moveThatBus) - 1;
                }
                else {
                    startIndex += moveThatBus;
                }
            }
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
