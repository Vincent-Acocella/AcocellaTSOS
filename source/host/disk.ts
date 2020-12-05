module TSOS{
        
    export class Disk{
        constructor(
            public track = 0,
            public sector = 0,
            public block = 0,
            public data = []
        ){
            this.track =0;
            this.sector=0;
            this.block=0;
            this.dataInit();
        }

        public dataInit(){
            for(let i = 0; i < 160; i++){
                this.data[i] = "0";
            }
        }

        public key(){
            return `${this.track}: ${this.sector}: ${this.block}`
        }

        public setAvalibility(aval){
            this.data[0] = aval.toString();
        }

        public getAvalibility(){
            return parseInt(this.data[0]);
        }

        public setKey(track, sector, block){
            this.track = track;
            this.sector = sector;
            this.block = block;
        }

        public setPointer(pointer: string){
            this.data[1] = pointer.charAt(0);
            this.data[2] = pointer.charAt(1);
            this.data[3] = pointer.charAt(2);
        }

        public getPointer(){
            let pointer = [this.data[1] , this.data[2] , this.data[3]]
            return pointer;
        }

        public storeInSession(){
            let diskAsJSON = {
                availability: this.getAvalibility(),
                pointer: this.getPointer(),
                data: this.data

            }
            return JSON.stringify(diskAsJSON);
        }
    }
        //keys
        //0:0:0
        //3:7:7

        //0:0:1
        //0:0:7 directory

        //Initialize disk
}