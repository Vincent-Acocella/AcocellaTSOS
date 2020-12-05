module TSOS{
    export class DeviceDiskDriver{

        constructor(public nextAvaliableBlock =1){}

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
                console.log(this.nextAvaliableBlock)

                let avaliableBlock = JSON.parse(sessionStorage.getItem(`0:0:${this.nextAvaliableBlock}`));

                avaliableBlock.data[0] = 1;
                avaliableBlock.avalibility = 1;

                let dataIndex = 3;
                
                for(let i = 0; i < fileName.length; i++){
                    avaliableBlock.data[dataIndex] = this.convertToHexByLetter(fileName.charAt(i))
                    dataIndex++
                }
                // console.log(avaliableBlock.data)
            }
        }

        public updateNextAvaliable(val){
            if (val < this.nextAvaliableBlock){
                this.nextAvaliableBlock = val;
            }
        }

        public getNextAvaliable(){

        }

        public convertToHexByLetter(char){
            console.log(parseInt(char,16))
            return parseInt(char,16);
            

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