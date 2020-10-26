module TSOS{
    export class DeviceDisplay{
        public bigThread = [];
            
        constructor() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpPCB();
            this.startUpSchedular();
        }

        public reload(){
            this.bigThread = [];
            this.updatePCB();
            this.updateCPU();
            //this.updateMemory();
            this.updateSchedular();
        }
        // this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
        public updateMemory(value){
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');
            //let results = TSOS.Utils.bigBrainMaths(value);

            let bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2,_Memory.memoryThread3);
            let currentSegment = _MemoryManager.segNum;

            //Index of the new value to be added to the table 
            //This was just updated
            //gets the row number
             let rowNum = ((currentSegment-1) * 32 + Math.floor(value/8));
             console.log(rowNum)
             let colNum = value % 8;
             console.log(colNum)
             let newValue = bigThread[(currentSegment-1)* 256 + value];
             console.log(newValue)

             //copy row
             //delete row
             //add new cell
             //replace row
             let tempRow = [];
             for(let i = 0; i< 8; i++){
                 tempRow[i] = (colNum === i)? tempRow[i]= newValue : tempRow[i] = table.rows[rowNum].cells[i];
             }
             table.deleteRow(rowNum);
             let row = table.insertRow(rowNum);

             for(let i = 0; i< 8; i++){
                row.insertCell(i).innerHTML = tempRow[i];
             }
        }

        public startUpMemory(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');
            //this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2,_Memory.memoryThread3);
            //console.log(_Memory.memoryThread[1].length);

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }
            //3 segments
            
            for(let h = 0; h < 3; h++){
                let i = 0;
                let rowNumber = h * 8;
                // let progSize = _MemoryAccessor.getSegmentToEndOfProg(h);
                let shift = 9;
                // let done = false;

                while(i < _Memory.memoryThread[h].length){
                    let row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber * 8);

                    // if(progSize - i < 8){
                    //     shift = (progSize - i);
                    //     done = true;
                    // }

                    for(let m = 1; m < shift; m++){
                         row.insertCell(m).innerHTML = "00"
                         i++;
                    }

                    // for(shift; shift < 9; shift++){
                    //     row.insertCell(shift).innerHTML = "00";
                    // }
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

        public startUpPCB(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }

            let header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];
            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }

            let row2 = table.insertRow(1);
            for(let i = 0; i < header.length; i++){
                let next = row2.insertCell(i);
                next.innerHTML = "0";
            }
        }

        public updatePCB(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");
            table.deleteRow(1);
            let header = _PCB.returnPCB();
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

            let header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];

            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
            //Look at schedule table
        }
        public updateSchedular(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("processeList");

            










        }
    }
}