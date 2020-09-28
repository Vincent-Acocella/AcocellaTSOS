module TSOS{

    export class MemoryAccessor{
        public progInMem = -1;
        public progToIndexMap=[];
        constructor() {
        }
        init(){
            _Memory.init();
        }
        //This is accounted for in memoryManager

        //Prog to index map is an array that uses its index to keep track of the coorelation from prog to startindex

        //Map is EX: [ 10, 5, 6]
        //              0  1  2
        // the 10 corresponds to the start index of the first program

        //Update the map
        // Iterates the progs in mem
        public updateMap(startIndex: number, endIndex: number){
            this.progInMem++
            this.progToIndexMap[this.progInMem] = [startIndex, endIndex];
            return this.progInMem;
        }

        public getMapValue(progNumber: number): number{
           return this.progToIndexMap[progNumber];
        }


        //Yes Yes I know I am loading the code in backwards into the array sue me. Is it wrong maybe but Watch it work.
        //I will be preforming my next magic trick by running backwards! Probably been done before but hey. I thought it's a cool idea
        //I wanted to make a map and work off that but this was done in about 10 lines of code so like. Better?

        //----------------------------------------------------------------------
        //Ahhhhh I was so young and ignorant. Why did I have that much confidence and then was wrong.

        public write(code: string){
            _Memory.memoryThread[_Memory.endIndex] = code;
            if(_Memory.endIndex !== 256) {
                _Memory.endIndex++;
                return true;
            }else{
                return false;
            }
        }
    }
}