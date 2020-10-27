module TSOS{
    export class DeviceDisplay{
        public bigThread = [];
            
        constructor() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpSchedular();
        }

        public reload(){
            this.bigThread = [];
            //this.updatePCB();
            //his.updateCPU();
            //this.updateMemory();
           // this.updateSchedular();
        }

        public updateMemory(index, seg){
            //index is the spot in memory
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');
            let rowNum = ((seg-1) * 32 + Math.floor(index/8));
            let colNum = index % 8;
            let newValue = _Memory.memoryThread[_MemoryAccessor.currentSegment];

            table.deleteRow(rowNum);
            let row = table.insertRow(rowNum);

            for(let i = rowNum; i < rowNum + 8; i++ ){
                if(i === colNum){
                    row.insertCell(i).innerHTML = newValue;
                }else{
                    row.insertCell(i).innerHTML = _Memory.memoryThread[rowNum][i];
                }  
            }
        }

        public startUpMemory(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }
            
            for(let h = 0; h < 3; h++){
                let i = 0;
                let rowNumber = h * 8;
                let shift = 9;
                while(i < _Memory.memoryThread[h].length){
                    let row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber * 8);
                    
                    for(let m = 1; m < shift; m++){
                         row.insertCell(m).innerHTML = "00";
                         i++;
                    }
                    rowNumber++;
                }
            }
        }

        public startUpCPU(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("cpu");
            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }

            let header = ["PC", "IR", "ACC", "X", "Y", "Z"];
            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = header[i];
            }
            let row2 = table.insertRow(1);
            for(let j = 0; j < header.length; j++){
                let next = row2.insertCell(j);
                next.innerHTML = "0";
            }
        }

        public updateCPU(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("cpu");
            table.deleteRow(1);
            let header = _CPU.returnCPU();
            let row = table.insertRow(1);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
        }

        public startUpSchedular(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("processeList");

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }

            let header = ["PID", "PC", "ACC", "X", "Y", "Z", "IR", "State", "Location"];

            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }

            for(let i = 1; i < 8; i++){
                let row = table.insertRow(i)
                for(let j = 0; j < header.length; j++){
                    row.insertCell(j).innerHTML = "";
                }
            }
            //Look at schedule table
        }

        public updateSchedular(PID){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("processeList");
            console.log()
            table.deleteRow(PID+1);
            let row = table.insertRow(PID+1);
            for(let j = 0; j < 9; j++){
                row.insertCell(j).innerHTML = _Schedular.allProcesses[PID][j];
            }
        }
    }
}