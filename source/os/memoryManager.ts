module TSOS{
    export class MemoryManager {
        public avaliableMemory = [];

        constructor() {
            this.avaliableMemory = [true, true, true];
        }
       
        //LOAD MEMORY INTO SELECTED SEGMENT
        public loadMemory(usrProg:string){

            //Need a function that returns the current segment for use
            let segment = this.deployNextSegmentForUse();
            let timeAdded = new Date().getTime();
            if(segment < 0){
                if(_FORMATTED){
                    segment = 9;
                    //Store program in backing store
                    _MemoryAccessor.nextProgInMem++;

                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, _MemoryAccessor.nextProgInMem, usrProg]))
                    _PCB.newTask(_MemoryAccessor.nextProgInMem, 9, 99);
                }else{
                    return -1;
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
            } 
            //didnt error
            return _MemoryAccessor.addProcess();
        }

        public runMemory(progNumber){
            let flag = false;
            //Checks to see if the program exists in memory
            //Includes() doesn't work :/
            let array = _MemoryAccessor.logicalMemory.slice(0);
            for(let i = 0; i < array.length; i++){
                if(array[i] === parseInt(progNumber)){
                    flag = true;
                }
            }

            if(flag){
                //Put in ready queue if no duplicates
                if(_Schedular.addToReadyQueue(progNumber)){
                //If CPU is not executing execute
                    if(!_CPU.isExecuting){
                        _Schedular.deployFirstInQueueToCPU();
                    }else{
                        _StdOut.putText("Program " + progNumber + " is already in the ready queue");
                    }
                }else{
                _StdOut.putText("Could not run program.... not in memory");
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
        public rollInProcess(data){
            console.log("GETTTTDEGYBDYBUB")

            //set prog map
            //set memory to false
            //set data to memory
            //Returns as hex
            console.log(data);
            let newSegment = this.deployNextSegmentForUse();
            _MemoryAccessor.getProgFromSegMap(newSegment)
            //update PCB
           this.avaliableMemory[newSegment] = false;
           _Memory.memoryThread[newSegment] = data.slice(0);

        }

        //Put process on disk
        public rollOut(){
            let PID =_PCB.PID;
            let data = _Memory.memoryThread[_PCB.location].slice(0);
            _KernelInputQueue.enqueue(new Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, PID, data]));
        }
    }
}