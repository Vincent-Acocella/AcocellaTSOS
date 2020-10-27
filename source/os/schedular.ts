module TSOS{

    export class Schedular {
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

        //this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location, this.endOfProg
        public singleProcess = [];
        public allProcesses = [[],[]];
        public quant = 6;
        public segInUse = [];
        public processesInSchedular = 0;
        public readyQueue = [];
        
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
            
            if(this.readyQueue.length > 0){
                this.queueReadyQueue(this.dequeueReadyQueue());
                this.refreshQuant();
                //Gets PID of next segment
                 //Switch process
                 _PCB.state = "Waiting";

                this.deployToCPU(); 
            }else{
                _StdOut.putText("All processes Complete");
                _CPU.isExecuting = false;
            }
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        }

        public addToProcessScheduler(){
            this.processesInSchedular++;
            this.singleProcess = _PCB.returnPCB().splice(0);
            let PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
        
            //Adds to ready queue
            this.queueReadyQueue(PID);
            _DeviceDisplay.updateSchedular(PID);
        }

        public deployToCPU(){
            let PID = this.readyQueue[0];
            this.allProcesses[PID][8] = "Executing";

            _DeviceDisplay.updateSchedular();
            _CPU.loadCPU(this.allProcesses[PID][1],
                this.allProcesses[PID][2],
                this.allProcesses[PID][3],
                this.allProcesses[PID][4],
                this.allProcesses[PID][5],
                this.allProcesses[PID][6],
                this.allProcesses[PID][7],
                this.allProcesses[PID][9])
                _DeviceDisplay.updateSchedular(PID);
        }

       public checkIfSwitch(){
            if( _Schedular.quant === 0){
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }else{
                    _Schedular.quant--;
            }
        }
        public programEnded(PID){

            this.allProcesses[PID][8] = "Terminated";
            this.allProcesses[PID][9] = 0;
            _MemoryAccessor.segmentsInUseSwitch(this.allProcesses[PID][9]);
        }

        public kill(PID){
            let flag = false;
            let i = 0;

            while(i < this.readyQueue.length && !flag){
                let temp = this.dequeueReadyQueue(); 
                if (PID === temp){
                    flag = true;
                }else{
                    this.queueReadyQueue(temp);
                    i++;
                }
            }

            //Put it back into order
            for(let j = 0; j < i; j++){
                this.queueReadyQueue(this.dequeueReadyQueue());
            }
            this.allProcesses[PID][8] = "Terminated";
        }

        public killAll(){
            for(let i = 0; i < this.readyQueue.length; i++){
                this.allProcesses[this.readyQueue[i]][8] = "terminated";
                this.dequeueReadyQueue();
            }
        }

        public queueReadyQueue(value){
            this.readyQueue.push(value);
        } 

        public dequeueReadyQueue(){
            let retVal = null;
            if (this.readyQueue.length > 0) {
                retVal = this.readyQueue.shift();
            }
            return retVal;
        }

        public terminateCurrentProcess(){
            this.allProcesses[this.readyQueue[0]][8] = "Complete";
            this.dequeueReadyQueue();
            _DeviceDisplay[this.dequeueReadyQueue()];
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
        }
    }
}