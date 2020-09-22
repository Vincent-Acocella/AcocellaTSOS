module TSOS{
    export class MemoryManager {
        constructor() {
            _Memory.init();
        }
            public loadMemory(usrProg){
            var curIndex=0;
            for (let i: number = 0; i < usrProg.length; i + 2) {
                let code: string = String.prototype.concat(usrProg.charAt(i) + usrProg.charAt(i + 1));
                _MemoryAccessor.write(code,i + _Memory.currentIndex -1);
                _Memory.currentIndex++;
            }
            return _Memory.progsInMem + 1;
        }
    }
}