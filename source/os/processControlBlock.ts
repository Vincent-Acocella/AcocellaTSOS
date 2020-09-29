module TSOS{

    export class ProcessControlBlock{

        constructor(
                    public PID: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public IR: string = "",
                    public state: number = 0,
                    public location: string = "memory",
                    public Zflag: number = 0) {
        }

        public init(): void {
            this.PID = 0;
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "";
            this.state = 0;
            this.location = "memory";
            this.Zflag = 0;
        }

        public newTask(PID){
            this.PID = parseInt(PID);
            console.log(_Memory.endIndex);
            _CPU.endOfProg = _Memory.endIndex;
            this.PC = _MemoryAccessor.getMapValue(this.PID);
            this.load();
        }

        //State 0 is idle
        //1 is running
        //2 is holding
        //3 Complete (Done) Back to 1 and clear

        public save(){
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Yreg = _CPU.Yreg;
            this.Xreg = _CPU.Xreg;
            this.IR = _CPU.IR;
            this.state = 2;
        }

        public load(){
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
            _CPU.IR = this.IR;
        }
        public returnPCB(){
            return [this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location];
        }

        public terminate(){
            _CPU.isExecuting = false;
            if (_StdOut.currentXPosition > 0) {
                _StdOut.clearCmdLine("");
            }
            _Memory.init();
            _DeviceDisplay = new DeviceDisplay();
            _PCB.init();
            _PCB.load();
            _MemoryAccessor.progInMem = -1;
        }
    }
}