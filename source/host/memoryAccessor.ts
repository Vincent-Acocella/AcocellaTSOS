module TSOS{

    export class MemoryAccessor{
        public progsInMem = 0;
        public progToIndexMap=[];
        constructor() {
        }
        init(){
            _Memory.init();
        }

        //progs in mem is a counter for the next free program spot +1
        //End index points to thelast spot +1 of the input

        //Prog to index map is an array that uses its index to keep track of the coorelation from prog to endindex

        //The array will be a map the index will be 1 infront of the stored index
        public updateMap(endIndex: number):number{
            this.progsInMem++
            this.progToIndexMap[this.progsInMem] = endIndex;
            return this.progsInMem;
        }

        //EX: prog 1 is stored in spot 0 but its progNumber is 1 so we have to back up 1 in the array
        public getMapValue(progNumber: number): number{
           return this.progToIndexMap[progNumber-1];
        }


        //Yes Yes I know I am loading the code in backwards into the array sue me. Is it wrong maybe but Watch it work.
        //I will be preforming my next magic trick by running backwards! Probably been done before but hey. I thought it's a cool idea
        //I wanted to make a map and work off that but this was done in about 10 lines of code so like. Better?

        public write(code: string){
            _Memory.memoryThread.push(code);
            _Memory.endIndex++;
        }





    }
}