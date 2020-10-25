module TSOS{
    export class MemoryAccessor{
        public progInMem = -1;
        public progToIndexMap = [];
        public memorySeg1 = _Memory.memoryThread;
        public memorySeg2 = _Memory.memoryThread;
        public memorySeg3 = _Memory.memoryThread;
        public currentSegment = 0;
        constructor() {
        }

        init(){
            _Memory.init();
        }

        //Update the map
        // Iterates the progs in mem
        public updateMap(startIndex: number){
            this.progInMem++
            this.progToIndexMap[this.progInMem] = startIndex;
            return this.progInMem;
        }

        //Return the start index of the Prog
        public getMapValue(progNumber: number): number{
           return this.progToIndexMap[progNumber];
        }

        public write(code: string){
            _Memory.memoryThread[_Memory.endIndex] = code;
            if(_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }else{
                return false;
            }
        }
        public getNextAvaliableMemSeg(){
            if(this.memorySeg1[0] !== "00"){
                return 1;
            }else if(this.memorySeg2[1] !== "00"){
                return 2;
            }else if(this.memorySeg3[1] !== "00"){
                return 3;
            }else{
                return -1;
            }
        }
    }
}