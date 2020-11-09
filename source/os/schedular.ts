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
        // 8 = location
        // 9 =  end of prog

        public readyQueue = new Queue;
        public allProcesses = [];
        public quant = _Quant;
        constructor(){
        }

        public init(){
        }

        public addProccess(PID){
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.startUpSchedular();
        }

        public deployToPCB(PID){
            this.allProcesses[PID];
        }

        public setQuant(value){
            _Quant = value;
            this.quant = value; 
        }

        public refreshQuant(){
            this.quant =_Quant;
        }

        //Update ready queue
        public switchMemoryUnit(){
            this.readyQueue.enqueue(this.readyQueue.dequeue());
            console.log("Switching ready queue");
        }

        public addToReadyQueue(PID){
            let added = false;
            if(!this.alreadyExistsInQueue(PID)){
                this.readyQueue.enqueue(PID);
                _DeviceDisplay.updateReadyQueue();
                added = true;
            }
            return added;
        }

        public addAllToReadyQueue(){
            //3 is the number of segments in memory
            let added = false;
           for(let i = 0; i < 3; i++){
               let prog = _MemoryAccessor.programToSegmentMap[i];
               if(prog > -1){
                   this.addToReadyQueue(prog);
                   added = true;
                }   
           }

           if(added){
            _CPU.isExecuting = true;
            _DeviceDisplay.updateReadyQueue();
           }else{
               _StdOut.putText("No more programs to execute");
           }
        }

        public alreadyExistsInQueue(prog){
            let flag = false;
            for(let i = 0; i < this.readyQueue.getSize(); i++){
                let pullVal = this.readyQueue.dequeue();
                this.readyQueue.enqueue(pullVal);
                if(parseInt(pullVal) === parseInt(prog)){
                     flag = true;
                 }
            }
            return flag;
        }

        public checkIfSwitch(){
            if(this.quant === 0){
                return true;

            }else{
                this.decreaseQuantum();
                return false;
            }      
        }

        public decreaseQuantum(){
            this.quant--;
            console.log("Quantum now equals: " + this.quant);
        }

        public switchMemory(){
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        }

        public deployFirstInQueueToCPU(){

            //This is the data we want
            let firstIndex = this.readyQueue.peek();
            this.allProcesses[firstIndex][7] = "Executing";
            var array = this.allProcesses[firstIndex];

            _PCB.loadPCB(array[0], array[1],array[2],array[3],array[4],array[5],array[6],array[7],array[8],array[9]);
            _PCB.loadCPU();
           // Load PCB then put into CPU
           console.log("Array that is being deployed is: " + array);
        }

        public startCpu(){
            this.deployFirstInQueueToCPU();
            _CPU.isExecuting = true;
        }

    }
}