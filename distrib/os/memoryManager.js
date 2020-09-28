var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //Load input into memory. It is in backwards! Its acually not tho!!!!!!!!
        MemoryManager.prototype.loadMemory = function (usrProg) {
            var startIndex = _Memory.endIndex;
            for (var i = 0; i < usrProg.length; i += 3) {
                //I'm mad at you. You load two things in glados so when my console log I thought I was wrong
                //The pain I was caused. The betrayal. I guess it makes up for my 7 commits last project :/
                // You 2 : me 0
                //Concats opcode
                var code = usrProg.charAt(i) + usrProg.charAt(i + 1);
                if (!_MemoryAccessor.write(code)) {
                    break;
                }
            }
            return _MemoryAccessor.updateMap(startIndex, _Memory.endIndex);
        };
        //Execute until previous end value is hit
        //The array keeps track of the past values uses the prev index as ref
        MemoryManager.prototype.runMemory = function (progNumber) {
            //get the map value
            if (progNumber <= _MemoryAccessor.progInMem) {
                _PCB.newTask(progNumber);
                _CPU.isExecuting = true;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
