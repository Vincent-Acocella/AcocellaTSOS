module TSOS{
    export class MemoryManager {
        constructor() {

        }
        //Load input into memory. It is in backwards!
            public loadMemory(usrProg:string){

             for(let i = 0;i < usrProg.length; i += 2){
                 let code: string = usrProg.substr(i,i+1);
                  _MemoryAccessor.write(code);
             }

             //Keep in mind the end index points to an empty or code of the next value
             var progsInMem = _MemoryAccessor.updateMap(_Memory.endIndex);
             return progsInMem;
        }

        //Execute until previous end value is hit
        //The array keeps track of the past values uses the prev index as ref
        public runMemory(progNumber){

            //This is where we account for the change in indexes
            //with the -1, we are not pointing to the first spot

            let endIndexOfProg = _MemoryAccessor.getMapValue(progNumber-1);
            let pastEndValue;

            //EX: If it is the first prog, the start is index 0 so we account
            if(progNumber !== 1) {
                pastEndValue  = _MemoryAccessor.getMapValue(progNumber - 1);
            }else{
                pastEndValue = 0;
            }

            //Loop through index of memory using end values so we go backwards
            //We start at the first element
            while(pastEndValue < endIndexOfProg){
                //_MemoryAccessor.execute(endIndexOfProg);





                endIndexOfProg--;
            }







        }
    }
}