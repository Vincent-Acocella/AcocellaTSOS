module TSOS {
    export class Memory {
        public memorySegment0 = [];
        public memorySegment1 = [];
        public memorySegment2 = [];
        public memoryThread = [];

        constructor() {
            this.memorySegment0 = [];
            this.memorySegment1 = [];
            this.memorySegment2 = [];
            this.memoryThread = [];
            this.init();
        }

        //Clear a signle thread of memory when complete or terminated
        public clearSingleThread(segment){
            for (let i = 0; i < 256; i++) {
                this.memoryThread[segment][i] = "00";
            }
        }
        public init() {
            for (let i = 0; i < 256; i++) {
                this.memorySegment0[i] = "00";
                this.memorySegment1[i] = "00";
                this.memorySegment2[i] = "00";
            }
            
            this.memoryThread = [this.memorySegment0, this.memorySegment1, this.memorySegment2];
        }
    }
}