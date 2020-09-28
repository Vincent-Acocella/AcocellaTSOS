module TSOS {
    export class Memory {
        public memoryThread= [];
        public endIndex;


        constructor() {
            this.memoryThread = [];
            this.endIndex = 0;
            this.init();
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
            this.endIndex = 0;
        }
    }
}