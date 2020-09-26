module TSOS{
    export class MemoryManager {
        constructor() {

        }
        //Load input into memory. It is in backwards!
            public loadMemory(usrProg:string){
             for(let i = 0;i < usrProg.length; i+=3){

                 //I'm mad at you. You load two things in glados so when my console log I thought I was wrong
                 //The pain I was caused. The betrayal. I guess it makes up for my 7 commits last project :/
                 // You 2 : me 0

                 let code:string = usrProg.charAt(i)+usrProg.charAt(i+1);
                 console.log(code);

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

            let endIndexOfCurProg = _MemoryAccessor.getMapValue(progNumber)-1;
            let pastEndValue;

            //The past end value is actually the first value

            //Map = [2,4]
            //Memory = [A9, 45, B4, 54, 0]
            // So prog 1 would end at the first value of the prog 1
            //The only other thing to account for is if it is the first prog which ends at 0

            //I think this works pretty cool. I don't know if this has been done(Probably) but I feel loke I am
            //Making this much more complicated than needed but like.... She's going to work

            if(progNumber !== 0) {
                pastEndValue  = _MemoryAccessor.getMapValue(progNumber);
            }else{
                pastEndValue = 0;
            }
            //Loop through index of memory using end values so we go backwards
            //We end at the first element (Explaination above)
            _MemoryAccessor.read(endIndexOfCurProg,pastEndValue);
        }
    }
}