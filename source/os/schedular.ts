module TSOS{
    export class Schedular{

     //across
        // 0 = progNumber
        // 1 = PC
        // 2 = ACC
        // 3 = Xreg
        // 4 = YReg
        // 5 = ZReg
        // 6 = IR 
        // 7 = state
        // 8 = locationstate
        // 9 = priority
        // 10 = timeAdded
        // 11 = location
        // 12 = end of prog

        //TODO: Update

        public readyQueue = new Queue;
        public allProcesses = [];
        public quant = _Quant;
        
        constructor(){
        }
        public init(){
        }

//--------------------------------------------------------
        //QUANT
        public setQuant(value){
            _Quant = value;
            this.quant = value; 
        }

        public refreshQuant(){
            this.quant =_Quant;
        }

        public decreaseQuantum(){
            this.quant--;
            console.log("Quantum now equals: " + this.quant);
        }

//--------------------------------------------------------

        //DEPLOY PROCCESS

        //Main funtion to return the PCB back to the array
        public addProccess(PID){
            this.allProcesses[PID] = _PCB.returnPCB().slice(0);
            _DeviceDisplay.startUpSchedular();
        }

        //Used to deploy to the CPU
        //Can be used after switch or initial start
        public deployFirstInQueueToCPU(){
            //This is the data we want
            let firstIndex = this.readyQueue.peek();
            console.log(firstIndex)
            
            if(_MemoryAccessor.getProgFromSegMap((firstIndex)) === -1){
                //Page Fault
                //see if there's an open spot in memory on process terminate
                let openSeg = _MemoryManager.deployNextSegmentForUse();
                console.log(openSeg)
                if(openSeg !== -1){
                    //Open ice take advantage
                    this.allProcesses[firstIndex][11] = openSeg;
                    _KernelInterruptQueue.enqueue(new Interrupt(DISKDRIVER_IRQ, [ROLLINPROG, firstIndex]));
                }else{
                    let pidToSwap;
                    //Checks
                    //RR enabled
                    //Priority Enabled

                    //Set the PCB to the info we want to switch
                    switch(_ActiveSchedular){
                        case _RoundRobin:
                            console.log("YOu come here");
                            //Get past PID
                            pidToSwap = this.readyQueue.getCaboose();
                            // this.addProccess(_PCB.PID);
                            break;

                        case _FCFS:
                            //Take out last entered in memory
                            break;
                        case _PRIORITY:
                            break;
                        default: 
                            //Single Run of process
                            //Take process process in block 3
                            pidToSwap = _MemoryAccessor.programToSegmentMap[2];
                    } 
                    //Get spot
                    let location = this.allProcesses[pidToSwap][11];

                    //Set the page table
                    _MemoryManager.avaliableMemory[location] = true;
                    _MemoryAccessor.setSegtoMemMap(firstIndex, location);
                    this.allProcesses[firstIndex][11] = location;

                    _KernelInterruptQueue.enqueue(new Interrupt(DISKDRIVER_IRQ, [ROLLOUTPROG, pidToSwap, _Memory.memoryThread[location].toString().replace(/,/g, ''), this.allProcesses[pidToSwap][12] ]));

                    _KernelInterruptQueue.enqueue(new Interrupt(DISKDRIVER_IRQ, [ROLLINPROG, firstIndex]));
                    this.allProcesses[pidToSwap][8] = "Disk";
                }
                //we deploy but the info doesn't get there until interputs
            }
            // console.log("Now Executing process:  " + firstIndex);
            this.allProcesses[firstIndex][7] = "Executing";
            this.allProcesses[firstIndex][8] = "Memory";
            var array = this.allProcesses[firstIndex];
            _PCB.loadPCB(array[0], array[1],array[2],array[3],array[4],array[5],array[6],array[7],array[8],array[9],array[10],array[11],array[12]);
            _PCB.loadCPU();

           // Load PCB then put into CPU
        }

        public startCpu(){
            this.refreshQuant();
            this.deployFirstInQueueToCPU();
            _DeviceDisplay.startUpSchedular();
            _CPU.isComplete = false;
            _CPU.isExecuting = true;
        }

//--------------------------------------------------------

        //SWITCH MEMORY
        public switchMemoryInterupt(){
            //Take PCB
            _PCB.copyCPU();
            _PCB.state = "Waiting";
            this.addProccess(_PCB.PID);
            this.switchMemoryUnit();
            this.startCpu();
            _DeviceDisplay.cycleReload();
        }

        //Update ready queue
        public switchMemoryUnit(){
            this.readyQueue.enqueue(this.readyQueue.dequeue());
        }

        public checkIfSwitch(){
            if(this.quant === 1){
                //queue up switch
                return true;
            }else{
                //decrease quant if there are more than 1 in ready queue
                this.decreaseQuantum();
                return false;
            }
        }

//--------------------------------------------------------
        //READY QUEUE

        public addToReadyQueue(PID){
            let added = false;
            if(!this.alreadyExistsInQueue(PID)){
                this.readyQueue.enqueue(PID);
                _DeviceDisplay.updateReadyQueue();
                added = true;
            }
            return added;
        }

        public removeFromReadyQueue(){
            this.readyQueue.dequeue();
            _PCB.updateScheduler();
            _DeviceDisplay.cycleReload();
        }

        public addAllToReadyQueue(){
            //3 is the number of segments in memory
            let added = false;

            for(let prog in _MemoryAccessor.logicalMemory){
                this.addToReadyQueue(prog);
                   added = true;
            }

           if(added){
               console.log(_ActiveSchedular)
              if(_ActiveSchedular === 3){
                    let size = this.readyQueue.getSize();

                    //alter ready Q
                    if(size > 1){
                    let array = [];
                    for(let i = 0; i < size; i++){
                        array[i] = this.readyQueue.dequeue();
                    }
                    let result = [];

                    let topP = array[0];
                    result.push(topP)
                    for(let i = 1; i < size; i++){
                        if(this.allProcesses[topP][9] > this.allProcesses[array[i]][9]){
                            topP = array[i];
                            result.unshift(array[i]);
                            //unshift
                        }else{
                            result.push(array[i])
                        }
                        console.log(result)
                    }

                    console.log(this.readyQueue.getSize())

                    for(let single in result){
                        this.readyQueue.enqueue(single);
                    }
                    console.log(this.readyQueue)
                }
              }

                _CPU.isExecuting = true;
                 this.deployFirstInQueueToCPU();
                _DeviceDisplay.updateReadyQueue();
           }else{
               _StdOut.putText("No more programs to execute");
           }
        }

        //UTIL
        public alreadyExistsInQueue(prog){

            for(let i = 0; i < this.readyQueue.getSize(); i++){
                let pullVal = this.readyQueue.dequeue();
                this.readyQueue.enqueue(pullVal);
                if(parseInt(pullVal) === parseInt(prog)){
                     return true;
                 }
            }
            return false;
        }

        //Check if the last program is finsihed executing
        public processComplete(prog){   
            _MemoryAccessor.removeProcess(prog);
            //Remove selected from queue
        loop1:
            for(let i = 0; i < this.readyQueue.getSize(); i++){
                let pullVal = this.readyQueue.dequeue();
                if(parseInt(pullVal) === parseInt(prog)){
                    break loop1
                 }else{
                    this.readyQueue.enqueue(pullVal);
                 }
            }
            
            if(this.readyQueue.getSize() === 0){
                _CPU.isExecuting = false;
                _StdOut.advanceLine();
            }else{
                this.startCpu();
            }
        }
    }
}