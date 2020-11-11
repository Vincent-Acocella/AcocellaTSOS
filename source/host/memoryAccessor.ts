module TSOS{

    export class MemoryAccessor{
        public nextProgInMem = -1;
        programToSegmentMap = [-1,-1,-1];

        constructor() {
        }
        init(){
            _Memory.init();
        }

        //Write from pysical memory to logical
        public write(code: string, segement:number, index:number){
            _Memory.memoryThread[segement][index] = code;
            
            //Chnage for single entry?
           // _DeviceDisplay.updateMemory();
        }

        public read(curIndex: number, segment:number){
            return _Memory.memoryThread[segment][curIndex];
        }


//-------------------------------------------------------------------------------

        //input the segment and program number
        public setSegtoMemMap(progNumber:number, segment:number){
            this.programToSegmentMap[segment] = progNumber;
        }

        //Returns segment from progNumber
        public getProgFromSegMap(progNumber){
            for(let i = 0; i< 3; i++){
                if(this.programToSegmentMap[i] === parseInt(progNumber)){
                    return i;
                }
            }
            return -1;
        }

        public removeProgFromSegMap(segement){
            this.programToSegmentMap[segement] = -1;
        }

        // Set memory as avaliable
        // clear memory 
        // reset map
        public programOverCleanUp(segment){
            _Memory.clearSingleThread(segment);
            this.removeProgFromSegMap(segment);
            _MemoryManager.avaliableMemory[segment] = true;
        }
    }
}