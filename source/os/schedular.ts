module TSOS{
    export class Schedular{
     //across
        // 0 = progNumber
        // 1 = PC
        // 2 = IR
        // 3 = ACC
        // 4 = Xreg
        // 5 = YReg
        // 6 = ZReg
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
            if(!this.alreadyExistsInQueue(PID)){
                this.readyQueue.enqueue(PID);
                _DeviceDisplay.updateReadyQueue();

                //Deploy
                 _CPU.isExecuting = true;
                
            }else{
                _StdOut.putText("Program " + PID + " is already in the ready queue");
            }
           
        }

        public addAllToReadyQueue(){

            //3 is the number of segments in memory
           for(let i = 0; i < 3; i++){
               let prog = _MemoryAccessor.programToSegmentMap[i];
               if(prog > -1){
                    if(!this.alreadyExistsInQueue(prog)){
                        this.readyQueue.enqueue(prog);
                    }else{
                        _StdOut.putText("Program " + i + " is already in the ready queue");
                    }
                }   
           }

           if(this.readyQueue.getSize() > 0){
            _CPU.isExecuting = true;
            _DeviceDisplay.updateReadyQueue();
           }else{
               _StdOut.putText("No programs to execute");
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

        // public checkIfSwitch(){
        //     if( this.quant === 0){
        //         _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        //     }else{
        //             this.quant--;
        //     }
        // }

    }
}