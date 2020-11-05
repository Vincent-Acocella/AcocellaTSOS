module TSOS{
    export class MemoryManager {
        public avaliableMemory = [];
        public currentMemorySegment = 0;

        constructor() {
            this.avaliableMemory = [true, true, true];
        }
       
        //LOAD MEMORY INTO SELECTED SEGMENT
        public loadMemory(usrProg:string){

            //Need a function that returns the current segment for use
            let segment = this.deployNextSegmentForUse();
            if(segment < 0){
                return -1
            }else{
                let index = 0;
                this.avaliableMemory[segment] = false;
                for(let i = 0; i < usrProg.length; i += 3){
                    let code:string = usrProg.charAt(i)+ usrProg.charAt(i+1);
                        _MemoryAccessor.write(code, segment, index); 
                        index++;
                }

                _DeviceDisplay.startUpMemory();
                _MemoryAccessor.nextProgInMem++
                return _MemoryAccessor.nextProgInMem ;
            }  
        }

        public runMemory(progNumber){

            // if(progNumber <= _MemoryAccessor.progInMem){
            //     _PCB.newTask(progNumber);
            //     _CPU.isExecuting = true;
            // }
        }

        //Checks for avaliable mem and if there is, mark it as in use
        public deployNextSegmentForUse(){

           for(let i = 0; i < 3; i++){
               if(this.avaliableMemory[i]){
                   return i;
               }
           }
            return -1 ;
        }
    }
}