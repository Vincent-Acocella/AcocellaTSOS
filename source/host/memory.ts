module TSOS {
    export class Memory {
        public memoryThread= [];
        public progsInMem;

        constructor() {
        }

        public init() {
            for (let i = 0; i < 256; i++) {
                this.memoryThread[i] = "00";
            }
        }
    }
}