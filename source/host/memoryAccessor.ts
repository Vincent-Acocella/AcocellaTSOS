module TSOS{
    export class MemoryAccessor{
        public progInMem = -1;
        public currentSegment = 1;
        public segsInUse = [false,false,false];
        public progToSegMap = [-1,-1,-1];
        constructor() {
        }

        init(){
             _Memory.init();
        }

        //Edit this function 
        //important
        public write(code: string){
            _MemoryManager.stationaryThread[_Memory.endIndex] = code;
            if(_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }else{
                return false;
            }
        }

        public getNextAvaliableMemSeg(){
            if(!this.segsInUse[0]){
                return 1;
            }else if(!this.segsInUse[1]){
                return 2;
            }else if(!this.segsInUse[2]){
                return 3;
            }else{
                return -1;
            }
        }

        public segmentsInUseSwitch(seg){
            this.segsInUse[seg]= !this.segsInUse[seg]
            //Array of 0s and 1s 
        }

        public foundInSegment(prog){
            for(let i = 0; i< this.progToSegMap.length; i++){
                if(this.progToSegMap[i] = prog){
                    return i +1;
                }
            }
            return -1;;
        }

    }
}