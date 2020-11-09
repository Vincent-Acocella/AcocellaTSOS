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
                    public Zflag: number = 0,
                    public endIndex: number = 0) {
        }

        public init(): void {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "x";
            this.state = "Unknown";
            this.location = -1;
            this.Zflag = 0;
            this.endIndex = 0;
        }

        public newTask(PID, segment, index){
            let tempPID = parseInt(PID);
            this.PID = tempPID;
            this.location = segment;
            this.endIndex = index;
            this.state = "ready";
            _Schedular.addProccess(PID);
        }

        public loadPCB(PID, PC, ACC, X, Y, Z,IR, state, loc, end){

            this.PID = PID;
            this.PC = PC;
            this.Acc = ACC;
            this.Xreg = X;
            this.Yreg = Y;
            this.Zflag = Z;
            this.IR = IR;
            this.state = state;
            this.location = loc;
            this.endIndex = end;
        }

        public loadCPU(){

            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
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