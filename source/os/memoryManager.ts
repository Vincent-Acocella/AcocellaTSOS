module TSOS{
    export class MemoryManager {
        constructor() {

        }
            public loadMemory(usrProg:string){

            // var curIndex = 0;
             let val = usrProg + "";
             _Kernel.krnTrace(val);

             for(let i = 0;i < 10; i += 2){
                 let code: string = usrProg.substr(i,i+1);
                  _MemoryAccessor.write(code,i + _Memory.currentIndex);
             }
             _Memory.progsInMem++;
             return _Memory.progsInMem;
        }
    }
}