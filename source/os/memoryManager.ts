module TSOS{
    export class MemoryManager {
        constructor() {

        }
        //Load input into memory. It is in backwards! Its acually not tho.
            public loadMemory(usrProg:string){
             for(let i = 0;i < usrProg.length; i+=3){

                 //I'm mad at you. You load two things in glados so when my console log I thought I was wrong
                 //The pain I was caused. The betrayal. I guess it makes up for my 7 commits last project :/
                 // You 2 : me 0

                 //Concats opcode
                 let code:string = usrProg.charAt(i)+usrProg.charAt(i+1);

                  if(!_MemoryAccessor.write(code)){
                      break;
                  }
             }
             //Keep in mind the end index points to an empty or code of the next value
                // Delt with in run
             var progsInMem = _MemoryAccessor.updateMap(_Memory.endIndex);
             return progsInMem;
        }

        //Execute until previous end value is hit
        //The array keeps track of the past values uses the prev index as ref
        public runMemory(progNumber){

            let startIndexOfCurProg = _MemoryAccessor.getMapValue(progNumber);
            let endIndex;

            //The past end value is actually the first value

            //Map = [2,4]
            //Memory = [A9, 45, B4, 54, 0]
            //The only other thing to account for is if it is the first prog which ends at 0

            //---------------------------------------

            //I thought I'd keep in the above comments as a learning experience. I somehow forgot how a stack worked. The array is not reverse

            if(progNumber !== 0) {
                endIndex  = _MemoryAccessor.getMapValue(progNumber + 1);
            }else{
                endIndex = _Memory.endIndex;
            }
            //Loop through index of memory using end values so we go backwards
            //We end at the first element (Explaination above)

            //We need to move back 1 of the end index
            _MemoryAccessor.read(startIndexOfCurProg, endIndex);
        }
    }
}