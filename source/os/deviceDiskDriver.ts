module TSOS{
    export class DeviceDiskDriver{

        constructor(public nextAvaliableBlock = 1, public currentPointer = [1,0,0], nextPointer = [1,0,1]){}



        /*

        |     Key   |   Value   |
        |_______________________|
        |           |           |
        |     000   |     001   | Current
        |           |      002  | current
        |           |           | 
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
        |           |           |
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
            if(this.checkOut(fileName)){
                let dataIndex = 0;
                console.log(this.nextAvaliableBlock)

                let avaliableBlock = JSON.parse(sessionStorage.getItem(`0:0:${this.nextAvaliableBlock}`));

                avaliableBlock.data[dataIndex] = "1";
                avaliableBlock.avalibility = 1;

                //Give value
                for(let i = 0; i < 3; i++){
                    avaliableBlock.data[dataIndex] = this.currentPointer[i].toString();
                    dataIndex++;
                }

                //Assign the name to the file
                for(let i = 0; i < fileName.length; i++){
                   let value:string = this.convertToHexByLetter(fileName.charCodeAt(i))
                   if(value.length > 1){

                    avaliableBlock.data[dataIndex] = value.charAt(0);
                    avaliableBlock.data[dataIndex +1] =  value.charAt(1);
                    dataIndex = dataIndex +2;

                   }else{
                    avaliableBlock.data[dataIndex] = value;
                    dataIndex++
                   }
                }

                sessionStorage.setItem(`0:0:${this.nextAvaliableBlock}`, JSON.stringify(avaliableBlock));
            }
        }


        //-----------------------------------------------------------------------------------

        public updateNextAvaliable(val){
            if (val < this.nextAvaliableBlock){
                this.nextAvaliableBlock = val;
            }
        }

        public getNextAvaliable(){

        }

        public setNextPointer(){

            let w = 1;
            //Searches linearly for next avaliable starting with next index
            while((JSON.parse(sessionStorage.getItem(`0;0;${this.nextAvaliableBlock + w}`))).avalibility !== 0){
                w++;
            }  
        }

        public convertToHexByLetter(charCode){
            console.log(charCode.toString(16))
            return charCode.toString(16)
        }

        public checkOut(str){
            //make sure avaliable exists
            //make sure no names match

            for(let i = 0; i < 8; i++){


            }
            return true;

        }
    }
}