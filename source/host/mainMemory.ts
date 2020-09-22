module TSOS {
    export class MainMemory {
        public memoryThread;
        public currentIndex;

        constructor() {
            this.memoryThread =[];
            this.currentIndex = 0;
            this.init();
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
        }
    }
}