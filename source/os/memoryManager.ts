module TSOS{
    export class MemoryManager {
        
        constructor() {
            
        }
        //Load input into memory.
            public loadMemory(usrProg:string){
                //Check which memory unit is availiable
                let memory = [];
                let segNum =_MemoryAccessor.getNextAvaliableMemSeg();
                
                switch(segNum){
                    case 1:
                        memory = _MemoryAccessor.memorySeg1;
                        break;
                    case 2:
                        memory = _MemoryAccessor.memorySeg2;
                        break;
                    case 3:
                        memory = _MemoryAccessor.memorySeg3;
                        break;
                    default:
                }

                //Write memory into desired segment
                if(memory.length == 0){
                    _MemoryAccessor.progInMem++;
                    let newProg = _MemoryAccessor.progInMem;
                    for(let i = 0; i < usrProg.length; i+=3){
                        //Concats opcode
                        let code:string = usrProg.charAt(i)+usrProg.charAt(i+1);
                        if(!_MemoryAccessor.write(code)){
                            break;
                        }
                        return newProg;
                    }
                }else{
                    _StdOut.putText("NO AVALIABLE MEMORY");
                    return -1;
                }
             
        }

        //The array keeps track of the past values uses the prev index as ref
        public runMemory(progNumber){
            //get the map value
            if(progNumber <= _MemoryAccessor.progInMem){
                _PCB.newTask(progNumber);
            }
        }

        public runAllMemory(){
            _RoundRobin = true;
            let size = _MemoryAccessor.progInMem
            //Add all to Schedular 
            for(let i = 0; i < size; i++){
                this.runMemory(i);
            }
            if(!_SingleStep){
                _CPU.isExecuting = true;
            }else{
                _StdOut.putText("Single Step is Enabled!");
            }
        } 
    }
}