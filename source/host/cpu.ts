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
                    public additionalBytesNeeded = 0,
                    public isExecuting: boolean = false) {
        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.additionalBytesNeeded = 0;
            this.isExecuting = false;
        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public runOpCode(code){
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
                    this.loadYregCons();
                    break;

                //Load the Y register from memory
                case "AC":
                    this.loadYregMem();
                    break;

                //No operation
                case "EA":
                    break;

                //break (which is really a system call)
                case "00":
                    break;

                //compare a byte in memory to the X reg. sets Z flag if =
                case "EC":
                    this.compXmem();
                    break;

                //Branch n bytes if Z flag =0
                case "D0":
                    this.branchIfZ();
                    break;

                //Increment the value of a byte
                case "EE":
                    this.incremVal();
                    break;

                //System Call
                case "FF":
                    break;
                default:
            }

            return this.additionalBytesNeeded;
        }


        private loadAcc(value) {
            this.additionalBytesNeeded = 1;
            this.Acc = _Memory.memoryThread[value-1];
        }

        private loadAccFrmMem(value) {
            this.additionalBytesNeeded = 2;
            if(_Memory.memoryThread[value-2].match("00")){
                //Load accumulator from memory means that we are taking the location in memory and returning the value to the Accumulator
                //Location 10 for example is the start position -10
               let numInMem = parseInt(_Memory.memoryThread[value-1]);
               this.Acc = _Memory.memoryThread[value - numInMem];
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private strAccInMem(value) {
            this.additionalBytesNeeded = 2;
            if(_Memory.memoryThread[value-2].match("00")){
                let locationToStore = parseInt(_Memory.memoryThread[value-1]);
                _Memory.memoryThread[locationToStore] = this.Acc;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private addCarry(value) {
            this.additionalBytesNeeded = 2;
            if (_Memory.memoryThread[value - 2].match("00")) {
                let valuetoAdd = parseInt(_Memory.memoryThread[value-1]);
                this.Acc = valuetoAdd + this.Acc;
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private loadXregCons(value) {
            this.additionalBytesNeeded = 1;
            this.Xreg = parseInt(_Memory.memoryThread[value-1]);
        }

        private loadXregMem(value) {
            this.additionalBytesNeeded = 2;
            if (_Memory.memoryThread[value - 2].match("00")) {
                let spotInMem = parseInt(_Memory.memoryThread[value - 1]);
                this.Xreg = _Memory.memoryThread[spotInMem];
            }else{
                _StdOut.putText("Only one memory segment exists currently");
            }
        }

        private loadYregCons() {

        }

        private loadYregMem() {

        }

        private compXmem() {

        }

        private branchIfZ() {

        }

        private incremVal() {

        }


    }
}
