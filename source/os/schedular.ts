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
        // 7 = endOfProg
        // 8 = state
        // 9 = location
        public singleProcess = [];
        public allProcesses = [[],[]];
        public quant = 6;
        public segInUse = [];
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

        public updateProcessInScheduler(){
            this.addToProcessScheduler();
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
                //Gets PID of next segment
                let i = 0;
                for(i; i <= _MemoryAccessor.progInMem; i++){
                    if(this.allProcesses[i][9] === lookAt){
                        break;
                    }
                }
                 //Switch process
                _PCB.state = "Waiting";
                this.deployToCPU(i); 
            //This is the main function of the schedular
            //First, look at quant
            //Second, see if quant was expired, if so look at queue
        }

        public addToProcessScheduler(){
            //Check this line
            this.singleProcess = _PCB.returnPCB();

            let PID = this.singleProcess[0];
            for(let i = 1; i < 5; i++){
                this.allProcesses[PID][i] = this.singleProcess[i];
            }
            console.log(this.allProcesses[PID].toString());
        }

        public deployToCPU(PID){
           this.updateProcessInScheduler();
           this.allProcesses[PID][8] = "Executing";
            for(let i = 1; i < 6; i++){
                this.singleProcess[i] = this.allProcesses[PID][i]; 
            }

            _CPU.loadCPU(this.singleProcess[1], 
            this.singleProcess[2],
            this.singleProcess[3],
            this.singleProcess[4],
            this.singleProcess[5],
            this.singleProcess[6],
            this.singleProcess[7]);
       }

    //    public removeFromScheduler(PID){
    //         this.allProcesses[PID][0] = _PCB.init();
    //    }

    //    public removeAllFromScheduler(){
    //     for (let i = 0; i <= _MemoryAccessor.progInMem; i++)  
    //         this.removeFromScheduler(i);
    //    }

       public checkIfSwitch(){
            if(_RoundRobin){
                if( _Schedular.quant !== 0){
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(SWITCH_MEMORY, ["Switching Memory"]));
                }else{
                    //Decrease the quant means we are staying in the same process
                    _Schedular.quant--;
                }
            }
        }

        public checkIfEmpty(val){


        }
    }
}