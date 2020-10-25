module TSOS{

    export class ProcessControlBlock{

        constructor(
                    public PID: number = 0,
                    public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public IR: string = "",
                    public endOfProg: number =0,  
                    public state: string = "none",
                    public location: number = 0
                    ) {
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.IR = "";
            this.state = "";
            this.location = 0;
            this.Zflag = 0;
        }

        public newTask(PID){
            this.init(); 
            this.PID = parseInt(PID);
            this.PC = _MemoryAccessor.getMapValue(this.PID);
            if(!_RoundRobin){
                this.loadToCPU();
                if(!_SingleStep){
                    _CPU.isExecuting = true;
                }else{
                    _StdOut.putText("Single Step is Enabled!");
                }

            }else{
                _Schedular.addToProcessScheduler();
            }
            //Instead of load we add to schudluer      
        }

        public putInReadyQueue(){
            _Schedular.updateProcessInScheduler();
        }

        //State 0 is idle
        //1 is running
        //2 is holding
        //3 Complete (Done) Back to 1 and clear

        //Add to 
        public updatePCB(){
            this.PC = _CPU.PC;
            this.Zflag = _CPU.Zflag;
            this.Yreg = _CPU.Yreg;
            this.Xreg = _CPU.Xreg;
            this.IR = _CPU.IR;
            this.endOfProg =_CPU.endOfProg;
        }

        //Load to cpu
        public loadToCPU(){
            _CPU.PC = this.PC;
            _CPU.Zflag = this.Zflag;
            _CPU.Yreg = this.Yreg;
            _CPU.Xreg = this.Xreg;
        }

        public returnPCB(){
            return [this.PID, this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag, this.state, this.location];
        }

        public addToPCB(PID: number, PC:number, Zflag:number, Yreg:number, Xreg:number, IR:string){
            this.PID = PID
            this.PC = PC;
            this.Zflag = Zflag;
            this.Yreg = Yreg;
            this.Xreg = Xreg;
            this.IR = IR;
            this.state = "running";
        }

        public terminate(){
            _CPU.isExecuting = false;
            if (_StdOut.currentXPosition > 0) {
                _StdOut.clearCmdLine("");
            }
            _Memory.init();
            _DeviceDisplay = new DeviceDisplay();
            _PCB.init();
            // _PCB.load();
            _MemoryAccessor.progInMem = -1;
        }
    }
}