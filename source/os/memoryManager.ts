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
                    _MemoryAccessor.progInMem++;
                    let newProg = _MemoryAccessor.progInMem;
                    for(let i = 0; i < usrProg.length; i+=3){
                        //Concats opcode
                        let code:string = usrProg.charAt(i)+usrProg.charAt(i+1);
                        _MemoryAccessor.write(code);
                    }
                    
                    //Used for the CPU
                    _MemoryAccessor.setSegmentToEndOfProg(this.segNum, _Memory.endIndex);
                    
                    //Switch the segment on
                    _MemoryAccessor.segmentsInUseSwitch(this.segNum);

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

                    console.log("Memory end index:  " + _Memory.endIndex);
                    for(let i = 0; i< _Memory.endIndex; i++){
                        if(i % 9 !== 0){
                            _DeviceDisplay.updateMemory(i);
                        }
                        
                    }
                    this.stationaryThread = [];

                    //Sets the Program in the segment
                    _MemoryAccessor.progToSegMap[this.segNum-1] = newProg;
                    return newProg;
                }else{
                    _StdOut.putText("NO AVALIABLE MEMORY");
                    return -1;
                }
        }

        public runMemory(progNumber){
            //get the map value
            if(_MemoryAccessor.foundInSegment(progNumber)){
                _PCB.newTask(progNumber);
            } else{
                _StdOut.putText("Program "+ progNumber+ " was not found in memory");
            }
        }

        public runAllMemory(){
            _RoundRobin = true;
            let size = _MemoryAccessor.progInMem;
            //Add all to Schedular 
            for(let i = 0; i < size; i++){
                this.runMemory(i);
            }
            //Look at the first segment and load it in the cpu
            _Schedular.deployToCPU(_MemoryAccessor.progToSegMap[0]);
            if(!_SingleStep){
                _CPU.isExecuting = true;
            }else{
                _StdOut.putText("Single Step is Enabled!");
            }
        }
        
        public fetchCurrentMemory(index): string{
            switch(_MemoryAccessor.currentSegment){
                case 1:
                    return _Memory.memoryThread1[index];
                case 2:
                    return _Memory.memoryThread2[index];
                case 3:
                    return _Memory.memoryThread3[index];
            }
        }
        public storeCurrentMemory(index, val){
            switch(_MemoryAccessor.currentSegment){
                case 1:
                    _Memory.memoryThread1[index] = val;
                    break;
                case 2:
                    _Memory.memoryThread2[index] = val;
                    break;
                case 3:
                    _Memory.memoryThread3[index] = val;
                    break;
            }
        }
    }
}