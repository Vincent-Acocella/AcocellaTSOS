module TSOS{
    export class MemoryManager {
        public stationaryThread = [];
        public segNum = 0;
        
        constructor() {
        }
        //Load input into memory.
            public loadMemory(usrProg:string){
                //Check which memory unit is availiable
                this.segNum = _MemoryAccessor.getNextAvaliableMemSeg();
                console.log("Segment Number to input into --  " + this.segNum);
                _Memory.endIndex = 0;

                //Write memory into desired segment
                if(this.segNum > 0){
                    
                    let newProg = _MemoryAccessor.iterateProgsInMem();
                    for(let i = 0; i < usrProg.length; i += 3){
                        //Concats opcode
                        let code:string = usrProg.charAt(i)+usrProg.charAt(i+1);
                        _MemoryAccessor.write(code);
                    }
                    
                    //Used for the CPU
                    _PCB.endOfProg = _Memory.endIndex;
                    _PCB.location = this.segNum;

                    switch(this.segNum){
                        case 1:
                            _Memory.memoryThread1 = this.stationaryThread.splice(0);
                            break;
                        case 2:
                            _Memory.memoryThread2 = this.stationaryThread.splice(0);
                            break;
                        case 3:
                            _Memory.memoryThread3 = this.stationaryThread.splice(0);
                            break;
                        default:
                    }

                    this.stationaryThread = [];

                    //Sets the Program in the segment
                    _MemoryAccessor.progToSegMap[this.segNum-1] = newProg;
                    
                    _PCB.newTask(newProg,_Memory.endIndex, this.segNum);
                    
                    return newProg;
                }else{
                    _StdOut.putText("NO AVALIABLE MEMORY");
                    _StdOut.advanceLine();
                    return -1;
                }
        }

        public runMemory(progNumber){
            //get the map value
            if(_MemoryAccessor.foundInSegment(progNumber)){
                _CPU.isExecuting = true;
            } else{
                _StdOut.putText("Program "+ progNumber+ " was not found in memory");
            }
        }

        public runAllMemory(){
            _RoundRobin = true;
            //Look at the first segment and load it in the cpu
            _Schedular.deployToCPU();
        }
    }
}