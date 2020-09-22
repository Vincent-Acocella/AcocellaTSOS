module TSOS {
    export class Memory {
        public memoryThread= [];
        public progsInMem;
        public currentIndex;

        constructor() {
            this.memoryThread = [];
            this.progsInMem = 0;
            this.currentIndex = 0;
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
        }
    }
}