var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
        }
        //Load input into memory. It is in backwards!
        MemoryManager.prototype.loadMemory = function (usrProg) {
            for (var i = 0; i < usrProg.length; i += 3) {
                var code = usrProg.charAt(i) + usrProg.charAt(i + 1);
                console.log(code);
                if (!_MemoryAccessor.write(code)) {
                    break;
                }
            }
            //Keep in mind the end index points to an empty or code of the next value
            // Delt with in run
            var progsInMem = _MemoryAccessor.updateMap(_Memory.endIndex);
            return progsInMem;
        };
        //Execute until previous end value is hit
        //The array keeps track of the past values uses the prev index as ref
        MemoryManager.prototype.runMemory = function (progNumber) {
            var endIndexOfCurProg = _MemoryAccessor.getMapValue(progNumber) - 1;
            var pastEndValue;
            //The past end value is actually the first value
            //Map = [2,4]
            // Memory = [A9, 45, B4, 54, 0]
            // So prog 1 would end at the first value of the prog 1
            //The only other thing to account for is if it is the first prog which ends at 0
            //I think this works pretty cool. I don't know if this has been done(Probably) but I feel loke I am
            //Making this much more complicated than needed but like.... She's going to work
            if (progNumber !== 0) {
                pastEndValue = _MemoryAccessor.getMapValue(progNumber);
            }
            else {
                pastEndValue = 0;
            }
            //Loop through index of memory using end values so we go backwards
            //We end at the first element (Explaination above)
            while (pastEndValue <= endIndexOfCurProg) {
                //_MemoryAccessor.execute(endIndexOfProg);
                endIndexOfCurProg--;
            }
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
