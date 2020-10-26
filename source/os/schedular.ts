module TSOS{

    export class Schedular {
        //across
        // 0 = progNumber
        // 1 = PC
        // 2 = ACC
        // 3 = Xreg
        // 4 = YReg
        // 5 = ZReg
        // 6 = IR
        // 8 = state
        // 9 = location
        public singleProcess = [];
        public allProcesses = [[],[]];
        public quant = 6;
        public segInUse = [];
        public processesInSchedular = 0;
        public readyQueue = [];
        public readyPointer = -1;
        
        constructor(
            //line Up Process id with index of all processes
            //Single process is just a PCB
        ){}

        public setQuant(value){
            _Quant = value;
            this.quant = value; 
        }
        public refreshQuant(){
            this.quant =_Quant;
        }


        public switchMem(){
            //get current segment
            //Go to the next segment 
            this.refreshQuant();

            if(this.readyQueue[this.readyPointer]){
                //Gets PID of next segment
                 //Switch process
                 _PCB.state = "Waiting";
                this.deployToCPU(); 
            }else{
                //Done
            }
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        }

        public addToProcessScheduler(){
            this.singleProcess = _PCB.returnPCB();
            let PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
            console.log(this.allProcesses[PID].toString());
            this.readyQueue[this.readyPointer+1] = PID;
            _DeviceDisplay.updateSchedular();
        }

        public deployToCPU(){

            let PID = this.readyQueue[this.readyPointer];
            this.allProcesses[PID][8] = "Executing";

            _DeviceDisplay.updateSchedular();
            _CPU.loadCPU(this.allProcesses[PID][1],
                this.allProcesses[PID][2],
                this.allProcesses[PID][3],
                this.allProcesses[PID][4],
                this.allProcesses[PID][5],
                this.allProcesses[PID][6],
                this.allProcesses[PID][7])
        }

       public checkIfSwitch(){

            if( _Schedular.quant === 0){
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }else{
                //killed
                    _Schedular.quant--;
                //Decrease the quant means we are staying in the same process
            }
        }

        public programEnded(PID){

            this.allProcesses[PID][8] = "Terminated";
            this.allProcesses[PID][9] = 0;
            _MemoryAccessor.segmentsInUseSwitch(this.allProcesses[PID][9]);
        }

        public kill(PID){
            this.allProcesses[PID][8] = "Terminated";
        }

        public killAll(){
            for(let i = 0; i < this.processesInSchedular; i++){
                this.kill(i);
            }
        }

        public terminateCurrentProcess(){
            this.allProcesses[this.readyQueue[0]][8] = "Terminated";
            if(this.readyQueue[1]){
                this.readyQueue[0] = this.readyQueue[1];
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }
        }
    }
}