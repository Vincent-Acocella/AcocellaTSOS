module TSOS {
    export class Memory {
        //Memory has to 768
        public memoryThread1 = [];
        public memoryThread2 = [];
        public memoryThread3 = [];
        public memoryThread = [];
        public endIndex;

        constructor() {
           this.init()
            this.endIndex = 0;
        }

        public refreshMemory(){
             this.memoryThread = [this.memoryThread1, this.memoryThread2, this.memoryThread3];
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread1[i] = "00";
                this.memoryThread2[i] = "00";
                this.memoryThread3[i] = "00";
            }
            this.memoryThread = [this.memoryThread1, this.memoryThread2, this.memoryThread3];
            this.endIndex = 0;
        }
    }
}