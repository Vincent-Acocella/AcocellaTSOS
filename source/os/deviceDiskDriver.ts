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

        public formatDisk(){

            //directory
            let index = 0;
            if(sessionStorage.getItem('0:0;0') === null){

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
                return true;
            }
            return false;  
        }

        public createFile(fileName: string){
            fileName = fileName.toString();
             //to create a file we put the name in hex (if it doesn't already exist) in the data at the next avaliable spot
            
             fileName = this.convertWordToHexByLetter(fileName)

             if(this.searchForFileByName(fileName)){
                let dataIndex = 0;
                console.log(this.nextAvaliableBlock)

                let avaliableBlock = JSON.parse(sessionStorage.getItem(`0:0:${this.nextAvaliableBlock}`));

                avaliableBlock.data[dataIndex] = "1";
                avaliableBlock.avalibility = 1;

                //Give pointer value
                for(let i = 0; i < 3; i++){
                    avaliableBlock.data[dataIndex] = this.currentPointer[i].toString();
                    dataIndex++;
                }

                //Assign the name to the file
                for(let i = 0; i < fileName.length; i++){  
                    avaliableBlock.data[dataIndex] = fileName.charAt(i);
                    dataIndex++
                }

                sessionStorage.setItem(`0:0:${this.nextAvaliableBlock}`, JSON.stringify(avaliableBlock));
            }

            this.setNextAvaliableBlock();
        }

        public deleteFile(fileName: string){
            //clear filename and set avaliability to 0
            //set next avaliable to index

            let dataIndex = 0;
            let removedBlock = JSON.parse(sessionStorage.getItem(`0;0;${this.nextAvaliableBlock}`));

             //set avalibility to 0
             removedBlock.avaliability = 0;
             removedBlock.data[dataIndex] = "0";

        }


        //-----------------------------------------------------------------------------------



        public searchForFileByName(fileName){
            //return the filename and the JSON with it 
            //if not return false
            let next = 4
            for(let i =0; i < 8; i++){
                let block = JSON.parse(sessionStorage.getItem(`0;0;${i}`))
                if(block.avalibility ! == 0){
                    //start at index 4 go until next = 0
                    while(block)



                }

            }
            




            //convert hex char codes to char codes then to letters




        }


        public setNextAvaliableBlock(){
            let next = 1
            while((next + this.nextAvaliableBlock < 8) && JSON.parse(sessionStorage.getItem(`0;0;${this.nextAvaliableBlock + next}`)).avalibility === 0 ){
                next++;
            }
            this.nextAvaliableBlock === this.nextAvaliableBlock + next;
        }

        public setNextAvaliablePointer(){

            let w = 1;
            //Searches linearly for next avaliable starting with next index
            while((JSON.parse(sessionStorage.getItem(`0;0;${this.nextAvaliableBlock + w}`))).avalibility !== 0){
                w++;
            }  
        }

        public convertWordToHexByLetter(filename){
            let newStr;
            for(let i = 0; i < filename.length; i++){
                newStr += parseInt(filename.charCodeAt(i),16)
            }
            return newStr
        }

    }
}