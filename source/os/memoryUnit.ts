


module TSOS {

    export class MemoryUnit {

        public memory = "1";
        public progsInMem = 0;
        public endIndex=0;

        public static startUpMemory(){
        }

       public addToMemory(code: string) {
            _Kernel.krnTrace(code);
        }




        // public currentIndex():number{
        //   //  return this.memory.length()-1;
        // }

    }
}