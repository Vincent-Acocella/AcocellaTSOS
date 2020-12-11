module TSOS{

    export class MemoryAccessor{
        public nextProgInMem = -1;
        //I made a page table before it was cool
        public programToSegmentMap = [-1,-1,-1];
        public logicalMemory = [];
        
        constructor() {
        }
        init(){
            _Memory.init();
        }

        //Write from logical memory to physical
        public write(code: string, segement:number, index:number){
            _Memory.memoryThread[segement][index] = code;
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
            this.removeProgFromSegMap(segment);
            _Memory.clearSingleThread(segment);
            _MemoryManager.avaliableMemory[segment] = true;
        }   

        public clearAllMemory(){
            _Memory.init();
            for(let i = 0; i < 3; i++){
                this.programOverCleanUp(i)
            }
        }

        //Called in load
        public addProcess(){
            this.logicalMemory.push(this.nextProgInMem);
            return this.nextProgInMem;
        }
        public removeProcess(prognumber){

            const index = this.logicalMemory.indexOf(prognumber);
            if(index > -1){
                this.logicalMemory.splice(index,1)
            }
                
        }
        
    }
}