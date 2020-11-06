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
            //Prolly no work
            console.log("PID being sent to display: " + PID);
            this.allProcesses[PID] = _PCB.returnPCB();
            _DeviceDisplay.updateSchedular(PID);
        }

        public deployToPCB(PID){
            this.allProcesses[PID]
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

        // public checkIfSwitch(){
        //     if( this.quant === 0){
        //         _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        //     }else{
        //             this.quant--;
        //     }
        // }

    }
}