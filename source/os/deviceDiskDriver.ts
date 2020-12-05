module TSOS{
    export class DeviceDiskDriver{

        constructor(
            public nextAvaliableBlock = 1, 
            public currentPointer = [1,0,0]
            )
            {}



        /*

        |     Key   |   Value   |
        |_______________________|
        |           |           |
        |     000   |     001   | Current
        |           |      002  | current
        |           |           | 
        |           |           |


        Flow

        Create: 
        Use Current Pointer
        *Sets*
        Set current to pointer 
        Iterate nextPointer up

        Delete:
        current is put on spot
        Next remains the same

        WOAH DOUBLE DELETE HOW DO WE KNOW 

        if current is avaliable than set nextPointer here

        AHHHHHHH TRIPPLE DELETE 

        if next is less than new spot do nothing
 -------------------------------------------------------------------
        SO THE RULES ARE AS FOLLOWS
        On create: 
        - Set current (It will be up to date) 
        - set current to next
        - Look for next if next is avaliable go to that
            - If no next set current to -1

        On delete: 
        - if current is before delete no nothing.
        - if next is before do nothing
        
        - If delete index is before current, 
            -  check current status.
                - If in use then set current status to deleted index (Leave next)
                - If current status is not used set next to current and current to deleted index

        - if current is before but delete is after
            - leave current move next to deleted

        Max 7 in Memory
        */

        public init(){

        }

//--------------------------------------------------------------
        //Called in shell
        public formatDisk(){

            //directory
            let index = 0;
            if(sessionStorage.getItem('0:0:0') === null){

            //First instance is always in use
            //used to hold next aval
            //take SingleDiskclass
                for(let i = 0; i<=3; i++){
                    for(let k = 0; k<= 7; k++){
                        for(let j = 0; j<= 7; j++){
                            let newDisk =  new Disk;
                            if(index === 0)newDisk.setAvalibility(1);
                            
                            sessionStorage.setItem(`${i}:${k}:${j}`, newDisk.storeInSession());
                            index++;
                        }
                    }
                }
                _FORMATTED = true;
                return true;
            }
            return false;  
        }

//--------------------------------------------------------------     
        //Called in shell
        public createFile(fileName: string){
             //to create a file we put the name in hex (if it doesn't already exist) in the data at the next avaliable spot

             if(this.searchForFileByName(fileName) < 0){
                let dataIndex = 0;

                let avaliableBlock = JSON.parse(sessionStorage.getItem(`0:0:${this.nextAvaliableBlock}`));
                avaliableBlock.data[dataIndex] = "1";
                avaliableBlock.availability = 1;
                dataIndex = dataIndex +3;

                console.log(fileName.length)

                //Assign the name to the file
                for(let i = 0; i < fileName.length; i++){ 
                    let value:string = this.convertToHexByLetter(fileName.charCodeAt(i));

                    if(value.length > 1){
                        avaliableBlock.data[dataIndex] = value.charAt(0);
                        avaliableBlock.data[dataIndex+1] = value.charAt(1);
                        dataIndex = dataIndex +2;
                    }else{
                        avaliableBlock.data[dataIndex] = fileName.charAt(0);
                        dataIndex++
                    }
                }
                //Set the item
                sessionStorage.setItem(`0:0:${this.nextAvaliableBlock}`, JSON.stringify(avaliableBlock));
                this.setNextAvaliableBlock();
                return true;
            }else{
                return false;
            }
        }
//--------------------------------------------------------------
        //Called in shell
        public deleteFile(fileName: string){
           fileName = fileName.toString();
            //clear filename and set avaliability to 0
            //set next avaliable to index

            let search = this.searchForFileByName(fileName)
            console.log(search)

            if(search > 0){

                let removingDisk = JSON.parse(sessionStorage.getItem(`0:0:${search}`));

                removingDisk.availability = 0;
                removingDisk.data[0] = "0";

                //Remove Pointer
                let removedPointer = JSON.parse(sessionStorage.getItem(`${removingDisk.data[1]}:${removingDisk.data[2]}:${removingDisk.data[3]}`));

                removedPointer.availability = 0;
                removedPointer.data[0] = "0";

                //Put back storage values
                sessionStorage.setItem(`0:0:${search}`, JSON.stringify(removingDisk));
                sessionStorage.setItem(`${removingDisk.data[1]}:${removingDisk.data[2]}:${removingDisk.data[3]}`, JSON.stringify(removedPointer));

                //Update next avaliable if needed
                if(search < this.nextAvaliableBlock){
                    this.nextAvaliableBlock = search;
                }

                //Update pointer if needed


                //TO DOOOOOOOOOOO



                return true;
            }else{
                return false
            }
        }


        public 

        //-----------------------------------------------------------------------------------

        public searchForFileByName(fileName: string){
            //return the filename and the JSON with it 
            //if not return false

            for(let i = 1; i < 8; i++){
                //iterate thru directory
                let next = 4;
                let block = JSON.parse(sessionStorage.getItem(`0:0:${i}`));
                //if avaliable check if the names match
                if(block.availability === 1){

                    let flag = true;
                    for(let j = 0; j < fileName.length; j++){
                        //compare by letter if one doesnt match break
                        let value:string = this.convertToHexByLetter(fileName.charCodeAt(j));

                        if(value.length > 1){
                           if(block.data[next] !== value.charAt(0) && block.data[next] !== value.charAt(1)){
                               flag = false;
                           }
                           next = next +2;
                        }else{
                            if(block.data[next] !== value.charAt(0)){
                                flag = false;
                            }
                            next++;
                        }
                    }
                    if(flag){
                        //we found a match!!!
                        return i;
                    }
                }
            }
            return -1;
        }


        public setNextAvaliableBlock(){
            let next = 1
            while((next + this.nextAvaliableBlock < 8) && JSON.parse(sessionStorage.getItem(`0:0:${this.nextAvaliableBlock + next}`)).availability === 0 ){
                next++;
            }
            this.nextAvaliableBlock === this.nextAvaliableBlock + next;
        }

        public setNextAvaliablePointer(){

            //Edit

            let w = 1;
            //Searches linearly for next avaliable starting with next index
            while((JSON.parse(sessionStorage.getItem(`0;0;${this.nextAvaliableBlock + w}`))).availability !== 0){
                w++;
            }  
        }

        public convertWordFromHexByLetter(filename: string){
            let newStr;
            console.log(filename)
            for(let i = 1; i <= filename.length; i++){
                console.log(i)
                console.log(filename.charCodeAt(i).toString(16))
                newStr += filename.charCodeAt(i).toString(16);
            }
            console.log(newStr)
            return newStr
        }

        public convertToHexByLetter(char: number) {
            console.log(char)
            console.log(char.toString(16))
            return char.toString(16);
        };
    }
}