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

    //Fix print

    export class Cpu {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public IR: string = "0",
                    public endOfProg = 0,
                    public bytesNeeded = 0,
                    public segment = -1,
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
            this.segment = -1;
            this.bytesNeeded = 0;
            this.isExecuting = false;
        }

        public cycle(): void {

            _Kernel.krnTrace('CPU cycle');
            let moveThatBus = this.fetch(this.PC);
            if(moveThatBus < 0){
                this.PC = (-1 * moveThatBus) -1 % 256;
                //Time to branch
            }else{
                //Increment by bytes
                this.PC+= moveThatBus;
                if(this.PC > this.endOfProg){
                    _StdOut.putText("Branched out of memory");
                }
            }

            //This Line has to Change
            if(this.PC > this.endOfProg){
                 _PCB.state = "Complete";
                _Schedular.removeFromReadyQueue();
                _Schedular.quant = 0;
            }

            _PCB.updateScheduler();
            _DeviceDisplay.cycleReload();

            //Check to see if we need to switch units

            //LEFT OFF HERE. NEED TO MAKE A CHECK FOR END OF ALL PROGRAMS 
            if(_Schedular.checkIfSwitch()){
                _Schedular.switchMemoryUnit();
            }else{
                if(_Schedular.readyQueue.getSize() !==1)
                    _Schedular.decreaseQuantum();
            }

            //_DeviceDisplay.updateMemory(this.segment, this.PC);
            //Update CPU and memory display in one cycle     
        }


        public fetch(PC){

            let opCode = _MemoryAccessor.read(PC,this.segment)

            console.log("Current OpCode: " + opCode)

            this.IR = opCode.toString();

            switch(opCode){
                //Load the accumulator with a constant
                case "A9":
                    this.loadAcc(PC);
                    break;

                //Load the accumulator from memory
                case "AD":
                    this.loadAccFrmMem(PC);
                    break;

                //store the accumulator in memory
                case "8D":
                    this.strAccInMem(PC);
                    break;

                //Add a carry
                case "6D":
                    this.addCarry(PC);
                    break;

                //Load the X register with a constant
                case "A2":
                    this.loadXregCons(PC);
                    break;

                //Load the X register from memory
                case "AE":
                    this.loadXregMem(PC);
                    break;

                //Load the Y register with a constant
                case "A0":
                    this.loadYregCons(PC);
                    break;

                //Load the Y register from memory
                case "AC":
                    this.loadYregMem(PC);
                    break;

                //No operation
                case "EA":
                    this.bytesNeeded = 1;
                    break;

                //break (which is really a system call)
                case "00":
                    this.break();
                    break;

                //compare a byte in memory to the X reg. sets Z flag if =
                case "EC":
                    this.compXmem(PC);
                    break;

                //Branch n bytes if Z flag = 0
                case "D0":
                    this.branchIfZ(PC);
                    break;

                //Increment the value of a byte
                case "EE":
                    this.incremVal(PC);
                    break;

                //System Call
                case "FF":
                    this.systemCall(PC);
                    break;
                default:

            }
            return this.bytesNeeded;
        }

//----------------------------------------------------------------------------------
        //Bytes needed = 1

        public systemCall(code){
            this.bytesNeeded = 1;
            switch (_CPU.Xreg) {
                case 1: // Print integer from y register
                    _CPU.printIntYReg();
                    break;
                case 2: // Print 00 terminated string from y register
                    _CPU.printStringYReg();
                    break;
                default:
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_STRING, ["Invalid system call operation, stoping execution."]));
            }
        }

//----------------------------------------------------------------------------------

        private loadAcc(value) {
            this.bytesNeeded = 2;

            //Loads next value in memory
            let newValue = _MemoryAccessor.read(value+1, this.segment)
            this.Acc = this.convToHex(newValue);
        }

        //All of this has to change

        //8D
        private loadAccFrmMem(value) {
            this.bytesNeeded = 3;

            //First byte is the op
            //Second is the segment
            //thrid is the location

          let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
          console.log("Segment found in memory: "+ segmentToLook);

          if(segmentToLook < 0){
              _StdOut.putText("Invalid opcode detected")
          }else{
            let valueInMemory = _MemoryAccessor.read(value + 2, segmentToLook);
            console.log("Location to grab: " + valueInMemory);
            this.Acc = valueInMemory;
          }
        }

        //Store the Acc in memory
        //value +2 is where to store 
        private strAccInMem(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                 _StdOut.putText("Invalid opcode detected")
            }else{
                _Memory.memoryThread[segmentToLook][value+2] = this.Acc
          }
        }

        private addCarry(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                 _StdOut.putText("Invalid opcode detected")
            }else{
                let valueToAdd = _MemoryAccessor.read(value+2, segmentToLook);
                this.Acc = valueToAdd + valueToAdd;
                console.log("Acc: " + this.Acc);
            }
        }

        private loadXregCons(value) {
            this.bytesNeeded = 2;
            this.Xreg = _MemoryAccessor.read(value+1, this.segment);
        }

        private loadXregMem(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                 _StdOut.putText("Invalid opcode detected");
            }else{
                this.Xreg = _MemoryAccessor.read(value + 2, segmentToLook)
            }
        }

        private loadYregCons(value) {
            this.bytesNeeded = 2;
             this.Yreg = _MemoryAccessor.read(value+1, this.segment);
        }

        private loadYregMem(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                 _StdOut.putText("Invalid opcode detected");
            }else{
                this.Yreg = _MemoryAccessor.read(value + 2, segmentToLook)
            }
        }

        private compXmem(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                 _StdOut.putText("Invalid opcode detected");
            }else{
                let valueToCompair = _MemoryAccessor.read(value+2,segmentToLook);
                this.Zflag = (this.Xreg === valueToCompair)? 1:0;
             }
        }

        private branchIfZ(value) {

            if(this.Zflag === 0){
                //Gets location to set the program counter to
                // this.PC = this.convToHex(_Memory.memoryThread[value + 1]);
                //If we are branching to 0
                if(this.PC === 0){
                    this.bytesNeeded = -1;
                }else{
                    console.log(this.PC);
                    this.bytesNeeded = (-1 * (this.PC+1));
                }
            }else{
                this.bytesNeeded = 2;
            }
        }

        private incremVal(value) {
            this.bytesNeeded = 3;

            let segmentToLook:number =  this.returnSegmentFromMemory(_MemoryAccessor.read(value+1, this.segment));
           
            if(segmentToLook < 0){
                _StdOut.putText("Invalid opcode detected");
            }else{
                _Memory.memoryThread[segmentToLook][value+2]++;
            }
        }
        
        private break() {
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(STOP_EXEC_IRQ, ["PID " + _PCB.PID + " has finished."]));
        }

  // ----------------------------------------------------------------------------------
  //FIX FIX FIX  
        private printIntYReg(){
            // #$01 in X reg = print the integer stored in the Y register.
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(PRINT_YREGInt_ERQ, ["Printing int from X register"]));
        }
        private printStringYReg(){
            // #$02 in X reg = print the 00-terminated string stored at the address in
            //  the Y register.
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TERMINATE_STRING, ["Printing int from X register"]));
        }

// ----------------------------------------------------------------------------------
        //CPU Utils
        public returnCPU(){
            return [this.PC, this.IR, this.Acc, this.Xreg, this.Yreg, this.Zflag];
        }

        private convToHex(value){
             return parseInt(value.toString(), 16);
        }

        //If this errors then there is an error in the code
        private returnSegmentFromMemory(byte){

            let temp = -1;

            switch(byte){
                case "00":
                    temp = 0;
                    break
                case "01":
                    temp = 1;
                    break
                case "02":
                    temp = 2;
                    break
                default:
                    return -1;
            }

            //If false that means it is in use which is good
            if(!_MemoryManager.avaliableMemory[temp]){
                return temp;
            }
            return -1;
        }
    }
}
