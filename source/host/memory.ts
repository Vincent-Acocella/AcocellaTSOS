module TSOS {
    export class Memory {
        //Memory has to 768
        public memoryThread1 = [];
        public memoryThread2 = [];
        public memoryThread3 = [];
        public endIndex;

        constructor() {
           this.init()
            this.endIndex = 0;
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread1[i] = "00";
                this.memoryThread2[i] = "00";
                this.memoryThread3[i] = "00";
            }
            this.endIndex = 0;
        }
    }
}