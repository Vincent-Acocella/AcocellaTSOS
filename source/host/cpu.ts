/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public IR: string = "0",
                    public endOfProg = 0,
                    public bytesNeeded = 0,
                    //public PCB = _PCB,
                    public isExecuting: boolean = false) {
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.IR = "";
            this.endOfProg = 0;
            this.bytesNeeded = 0;
            //this.PCB = null;
            this.isExecuting = false;
        }

        public cycle(): void {
            _DeviceDisplay.updateCPU();
            _DeviceDisplay.updatePCB();
            _PCB.state = 1;
            _Kernel.krnTrace('CPU cycle');
            let moveThatBus = this.fetch(_Memory.memoryThread[this.PC]);
            if(moveThatBus < 0){
                //Time to branch
                this.PC = (-moveThatBus)-1;
            }else{
                //Increment by bytes
                this.PC+= moveThatBus;
            }
            if(this.PC < this.endOfProg){
                this.isExecuting =false;
                _PCB.state = 3;
            }
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public fetch(code){
            let opCode = _Memory.memoryThread[code];
            switch(opCode){
                //Load the accumulator with a constant
                case "A9":
                    this.loadAcc(code);
                    break;

                //Load the accumulator from memory
                case "AD":
                    this.loadAccFrmMem(code);
                    break;

                //store the accumulator in memory
                case "8D":
                    this.strAccInMem(code);
                    break;

                //Add a carry
                case "6D":
                    this.addCarry(code);
                    break;

                //Load the X register with a constant
                case "A2":
                    this.loadXregCons(code);
                    break;

                //Load the X register from memory
                case "AE":
                    this.loadXregMem(code);
                    break;

                //Load the Y register with a constant
                case "A0":
                    this.loadYregCons(code);
                    break;

                //Load the Y register from memory
                case "AC":
                    this.loadYregMem(code);
                    break;

                //No operation
                case "EA":
                    this.bytesNeeded = 1;
                    break;

                //break (which is really a system call)
                case "00":
                    break;

                //compare a byte in memory to the X reg. sets Z flag if =
                case "EC":
                    this.compXmem(code);
                    break;

                //Branch n bytes if Z flag =0
                case "D0":
                    this.branchIfZ(code);
                    break;

                //Increment the value of a byte
                case "EE":
                    this.incremVal(code);
                    break;

                //System Call
                case "FF":
                    break;
                default:
            }
            this.PC++;
            return this.bytesNeeded;
        }


        private loadAcc(value) {
            this.bytesNeeded = 3;
            this.Acc = _Memory.memoryThread[value+1];
        }

        private loadAccFrmMem(value) {
            this.bytesNeeded = 3;
            if(_Memory.memoryThread[value+2].match("00")){
                //Load accumulator from memory means that we are taking the location in memory and returning the value to the Accumulator
                //Location 10 for example is the start position -10
                //FIX FIX FIX
               let numInMem = parseInt(_Memory.memoryThread[value+1]);
               this.Acc = _Memory.memoryThread[numInMem];
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private strAccInMem(value) {
            this.bytesNeeded = 3;
            if(_Memory.memoryThread[value+2].match("00")){
                let locationToStore = parseInt(_Memory.memoryThread[value+1]);
                _Memory.memoryThread[locationToStore] = this.Acc;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private addCarry(value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                let valuetoAdd = parseInt(_Memory.memoryThread[value+1]);
                this.Acc = valuetoAdd + this.Acc;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private loadXregCons(value) {
            this.bytesNeeded = 2;
            this.Xreg = parseInt(_Memory.memoryThread[value+1]);
        }

        private loadXregMem(value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                let spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Xreg = _Memory.memoryThread[spotInMem];
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private loadYregCons(value) {
            this.bytesNeeded = 2;
            this.Yreg = parseInt(_Memory.memoryThread[value+1]);
        }

        private loadYregMem(value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                let spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Yreg = _Memory.memoryThread[spotInMem];
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private compXmem(value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                let spotInMem = parseInt(_Memory.memoryThread[value + 1]);
                this.Zflag = (this.Xreg === spotInMem)? 1:0;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private branchIfZ(value) {

            if(this.Zflag === 0){
                this.PC = parseInt(_Memory.memoryThread[value + 1]);
                if(this.PC === 0){
                    this.bytesNeeded = -1;
                }else{
                    //Do this to account for a branch to 0
                    this.bytesNeeded = -(this.PC+1);
                }
            }else{
                this.bytesNeeded = 3;
            }
        }

        private incremVal(value) {
            this.bytesNeeded = 3;
            if (_Memory.memoryThread[value + 2].match("00")) {
                let temp = parseInt(_Memory.memoryThread[value + 1]);
                _Memory.memoryThread[value+1] = temp+1;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }
        public returnCPU(){
            return [this.PC,this.IR,this.Acc,this.Xreg,this.Yreg,this.Zflag];
        }

        private finsihedProg(){
           this.isExecuting = (this.PC < this.endOfProg)? true: false;
        }
    }
}
