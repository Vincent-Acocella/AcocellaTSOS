module TSOS{

    export class ProcessControlBlock{

        // 0 = progNumber
        // 1 = PC
        // 2 = IR
        // 3 = ACC
        // 4 = Xreg
        // 5 = YReg
        // 6 = ZReg
        // 7 = state
        // 8 = location
        // 9 = end of prog

        constructor(
                    public PID: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public IR: string = "x",
                    public state: string = "",
                    public location: number = -1,
                    public locationState:string = "",
                    public Zflag: number = 0,
                    public timeAdded:number = 0,
                    public priority:number = 0,
                    public endIndex: number = 0) {
        }

        public init(): void {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "x";
            this.locationState ="";
            this.state = "Unknown";
            this.location = -1;
            this.Zflag = 0;
            this.timeAdded = 0;
            this.priority = 0;
            this.endIndex = 0;
        }

        public newTask(PID, segment, index){
            //We need to save the state of the PCB in case it is being used
            let tempPCB = this.returnPCB();
            this.init();
            let tempPID = parseInt(PID);
            this.PID = tempPID;
            this.location = segment;
            if(this.location > 2){
                this.locationState = "Disk"
            }else{
                this.locationState= "Memory"
            }
            this.endIndex = index;
            this.state = "ready";
            _Schedular.addProccess(PID);
            this.loadPCB(tempPCB[0],tempPCB[1],tempPCB[2],tempPCB[3],tempPCB[4],tempPCB[5],tempPCB[6],tempPCB[7],tempPCB[8],tempPCB[9])
        }

        public terminateCPU(){
            this.state = "terminated";
            //_MemoryAccessor.programOverCleanUp(this.location);
            //this.location = -1;
            _Schedular.processComplete();
        }

        public loadPCB(PID, PC, ACC, X, Y, Z,IR, state, loc, end){
            this.PID = PID;
            this.PC = PC;
            this.Acc = ACC
            this.Xreg = X;
            this.Yreg = Y;
            this.Zflag = Z;
            this.IR = IR;
            this.state = state;
            this.location = loc;
            this.endIndex = end;
        }

        public copyCPU(){
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Xreg = _CPU.Xreg;
            this.location = _CPU.segment;
            this.IR = _CPU.IR;
            this.Acc = _CPU.Acc;
            this.endIndex = _CPU.endOfProg;
            this.Yreg = _CPU.Yreg;
        }

        public updateScheduler(){
            this.copyCPU();
            _Schedular.addProccess(this.PID);
        }

        public loadCPU(){
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Acc = this.Acc
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
            _CPU.IR = this.IR;
            _CPU.segment = this.location;
            _CPU.endOfProg = this.endIndex;
        }
        
        public returnPCB(){
            return [this.PID, this.PC,this.Acc, this.Xreg, this.Yreg, this.Zflag, this.IR, this.state, this.location, this.endIndex];
        }
    }
}