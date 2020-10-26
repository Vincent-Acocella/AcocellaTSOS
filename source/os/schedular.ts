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
            let lookAt = 1;

                //Account for empty segment
            switch(_MemoryAccessor.currentSegment){
                case 1:
                    lookAt = 2;
                    break;
                case 2:
                    lookAt = 3;
                    break;
                }
                _MemoryAccessor.currentSegment = lookAt;
                //Gets PID of next segment
               
                 //Switch process
                 _PCB.state = "Waiting";
                this.deployToCPU(_MemoryAccessor.progToSegMap[lookAt-1]); 
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        }

        public addToProcessScheduler(){
            //Check this line
            this.singleProcess = _PCB.returnPCB();
            let PID = this.singleProcess[0];
            this.allProcesses[PID] = this.singleProcess.splice(0);
            console.log(this.allProcesses[PID].toString());

            this.readyQueue[this.readyQueue.length+1] = PID;
        }

        public deployToCPU(PID){

           this.addToProcessScheduler();
           this.allProcesses[PID][8] = "Executing";

            for(let i = 1; i < 6; i++){
                this.singleProcess[i] = this.allProcesses[PID][i]; 
            }

            _PCB.PID = PID;
            _CPU.loadCPU(this.allProcesses[PID][1],
                this.allProcesses[PID][2],
                this.allProcesses[PID][3],
                this.allProcesses[PID][4],
                this.allProcesses[PID][5],
                this.allProcesses[PID][6],
                this.allProcesses[PID][7])
        }

       public checkIfSwitch(){
            if( _Schedular.quant !== 0){
                _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TIMER_IRQ, ["Switching Memory"]));
            }else{
                //Decrease the quant means we are staying in the same process
                _Schedular.quant--;
            }
        }

        public readyToRoll(){
            
        }

        public programEnded(PID){
            this.allProcesses[PID][8] = "Terminated";
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
    }
}