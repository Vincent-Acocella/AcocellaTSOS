module TSOS{
    export class MemoryAccessor{
        public progInMem = -1;
        public currentSegment = 1;
        public segsInUse = [false,false,false];
        public endOfProgMap = [256,256,256];
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

        public setSegmentToEndOfProg(seg, value){
            console.log("Setting the Segment: "+ seg+ "To the value of : " + value);
            this.endOfProgMap[seg-1] = value;
        }

        //1 seg is stored in 0
        public getSegmentToEndOfProg(seg){
            console.log("Returning the value: "+  this.endOfProgMap[seg-1] +  "for the Segment: "+ seg);
             return this.endOfProgMap[seg-1];
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