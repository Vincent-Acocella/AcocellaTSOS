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
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.startUpSchedular();
        }

        //Used to deploy to the CPU
        //Can be used after switch or initial start
        public deployFirstInQueueToCPU(){

            //This is the data we want
            let firstIndex = this.readyQueue.peek();
            this.allProcesses[firstIndex][7] = "Executing";
            var array = this.allProcesses[firstIndex];

            _PCB.loadPCB(array[0], array[1],array[2],array[3],array[4],array[5],array[6],array[7],array[8],array[9]);
            _PCB.loadCPU();
           // Load PCB then put into CPU
        }

        public startCpu(){
            this.deployFirstInQueueToCPU();
            _CPU.isExecuting = true;
        }

//--------------------------------------------------------

        //SWITCH MEMORY

        public switchMemoryInterupt(toDo){


            
        }

        //Update ready queue
        public switchMemoryUnit(){
            this.readyQueue.enqueue(this.readyQueue.dequeue());
            console.log("Switching ready queue");
        }

        public checkIfSwitch(){
            //If the ready queue is empty but the quant is not 0, it was killed so check for both
            return (this.quant === 0 && this.readyQueue.getSize() > 1)
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
            _DeviceDisplay.updateReadyQueue();
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

        //UTIL
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

        //Check if the last program is finsihed executing
        public isDone(){
            if(this.readyQueue.getSize() === 0){
                _CPU.isExecuting = false;
                return true;
            }else{
                return false;
            }
        }
    }
}