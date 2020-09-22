module TSOS{

    export class MemoryAccessor{
        public progsInMem = 0;
        constructor() {
        }
        init(){
            _Memory.init();
        }

        public write(code: string,index: number){
            _Memory.memoryThread[index] = code;
        }
    }
}