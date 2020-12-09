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
                if(_FORMATTED){
                    //Store program in backing store

                    //Create format for file names

                }else{
                    return -1
                }
            }else{
                let index = 0;
                this.avaliableMemory[segment] = false;
                for(let i = 0; i < usrProg.length; i += 3){
                    let code:string = usrProg.charAt(i)+ usrProg.charAt(i+1);
                        _MemoryAccessor.write(code, segment, index); 
                        index++;
                }
                
                _MemoryAccessor.nextProgInMem++;
                _PCB.newTask(_MemoryAccessor.nextProgInMem, segment, index);

                //Set the map from program to segment
                _MemoryAccessor.setSegtoMemMap(_MemoryAccessor.nextProgInMem, segment);
                _DeviceDisplay.startUpMemory();
                return _MemoryAccessor.nextProgInMem ;
            }  
        }

        public runMemory(progNumber){

            let segment = _MemoryAccessor.getProgFromSegMap(progNumber);
            //Checks to see if the program exists in memory
            if(segment < 0){
                _StdOut.putText("Could not run program.... not in memory");
            }else{

                //Put in ready queue if no duplicates
               if(_Schedular.addToReadyQueue(progNumber)){
                //If CPU is not executing execute
                if(!_CPU.isExecuting){
                    _Schedular.deployFirstInQueueToCPU();
                    _Schedular.startCpu();
                }
               }else{
                _StdOut.putText("Program " + progNumber + " is already in the ready queue");
               }
            }
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

        public listProgsInMem(){
            let output =[];

            for(let i = 0; i < 3; i++){
                if(!this.avaliableMemory[i]){
                    output[i] = _MemoryAccessor.programToSegmentMap[i]
                }
            }
            return output;
        }


        //Take process off disk
        public rollIn(){


        }

        //Put process on disk
        public rollOut(){

        }


    }
}