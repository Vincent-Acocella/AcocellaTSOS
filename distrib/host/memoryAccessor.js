var TSOS;
(function (TSOS) {
    var MemoryAccessor = /** @class */ (function () {
        function MemoryAccessor() {
            this.nextProgInMem = -1;
            //I made a page table before it was cool
            this.programToSegmentMap = [-1, -1, -1];
            this.logicalMemory = [];
        }
        MemoryAccessor.prototype.init = function () {
            _Memory.init();
        };
        //Write from logical memory to physical
        MemoryAccessor.prototype.write = function (code, segement, index) {
            _Memory.memoryThread[segement][index] = code;
        };
        MemoryAccessor.prototype.read = function (curIndex, segment) {
            return _Memory.memoryThread[segment][curIndex];
        };
        //-------------------------------------------------------------------------------
        //input the segment and program number
        MemoryAccessor.prototype.setSegtoMemMap = function (progNumber, segment) {
            this.programToSegmentMap[segment] = progNumber;
        };
        //Returns segment from progNumber
        MemoryAccessor.prototype.getProgFromSegMap = function (progNumber) {
            for (var i = 0; i < 3; i++) {
                if (this.programToSegmentMap[i] === parseInt(progNumber)) {
                    return i;
                }
            }
            return -1;
        };
        MemoryAccessor.prototype.removeProgFromSegMap = function (segement) {
            this.programToSegmentMap[segement] = -1;
        };
        // Set memory as avaliable
        // clear memory 
        // reset map
        MemoryAccessor.prototype.programOverCleanUp = function (segment) {
            this.removeProgFromSegMap(segment);
            _Memory.clearSingleThread(segment);
            _MemoryManager.avaliableMemory[segment] = true;
        };
        MemoryAccessor.prototype.clearAllMemory = function () {
            _Memory.init();
            for (var i = 0; i < 3; i++) {
                this.programOverCleanUp(i);
            }
        };
        //Called in load
        MemoryAccessor.prototype.addProcess = function () {
            this.logicalMemory.push(this.nextProgInMem);
            console.log(this.logicalMemory);
            return this.nextProgInMem;
        };
        return MemoryAccessor;
    }());
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
