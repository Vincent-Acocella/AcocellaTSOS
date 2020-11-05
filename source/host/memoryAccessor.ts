module TSOS{

    export class MemoryAccessor{
        public nextProgInMem = -1;
        constructor() {
        }
        init(){
            _Memory.init();
        }

        //Write from pysical memory to logical
        public write(code: string, segement:number, index:number){
            console.log("AT Segment: " + segement + " and index " + index + " ====" + code);
            _Memory.memoryThread[segement][index] = code;
            
            //Chnage for single entry?
            _DeviceDisplay.updateMemory();
        }

        public read(curIndex: number, segment:number){
            return _Memory.memoryThread[segment][curIndex]
        }
    }
}