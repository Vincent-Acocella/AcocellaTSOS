module TSOS{
    export class DeviceDisplay{

        constructor() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpSchedular();
        }

        public cycleReload(){
           this.updateCPU();
           this.updateSchedular();
           this.startUpMemory();
           this.updateReadyQueue();
        }

        public updateMemory(){
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');


            let index = 0;
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = _Memory.memoryThread[index].toString();
                    table.rows[i].cells.item(j).style['font-weight'] = "normal";
                    if(index === _CPU.PC){
                        table.rows[i].cells.item(j).style.color = "magenta";
                    }else{
                        table.rows[i].cells.item(j).style.color = "black";
                    }
                    index++;
                }
            }
        }

        public startUpMemory(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');
            let stringMemory = _Memory.memoryThread[0].concat(_Memory.memoryThread[1],_Memory.memoryThread[2]);

                 while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }
            
            let index = 0;
            let numberOfRows = stringMemory.length / 8;
            for (let i = 0; i < numberOfRows; i++) {
                let row = table.insertRow(i);
                let memAdress = i * 8;
                let first = row.insertCell(0);
                row.cells.item(0).style.textAlign = "center";
                row.cells.item(0).style.border = "1px solid black";

                let memUnit = "0x";
                for (let j= 0; j < 3 - memAdress.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += memAdress.toString(16);
                first.innerHTML = memUnit;

                for (let k = 1; k < 9; k++) {
                    let cell = row.insertCell(k);
                    cell.style.textAlign = "center";
                    cell.style.border = "1px solid black";
                    cell.innerHTML = stringMemory[index];
                    index++;
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
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
                next.innerHTML = header[i];
            }
            let row2 = table.insertRow(1);
            for(let j = 0; j < header.length; j++){
                let next = row2.insertCell(j);
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
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
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
                next.innerHTML = String(header[i]);
            }
        }
        public updateSchedular(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("processeList");
            table.deleteRow(_PCB.PID+1);
            let row = table.insertRow(_PCB.PID+1);

            for(let i = 0; i < 9; i++){
               row.insertCell(i).innerHTML =_Schedular.allProcesses[_PCB.PID][i]
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

            for(let i = 1; i < _MemoryAccessor.nextProgInMem + 2; i++){
                let row = table.insertRow(i);
                for(let j = 0; j < header.length; j++){
                    row.insertCell(j).innerHTML = _Schedular.allProcesses[i-1][j];
                }
            }
        }

        public updateReadyQueue(){
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById("readyQ");

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }

            let row = table.insertRow(0);
            row.insertCell(0).innerHTML = _Schedular.readyQueue.toString();

        }


        public hardDriveDisplay(){
            //Set the key equal to the row key
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById("hardDrive");

            while(table.hasChildNodes())
            {
                table.removeChild(table.firstChild);
            }

            let firstRow = table.insertRow(0);
            firstRow.insertCell(0).innerHTML = "Key";
            firstRow.insertCell(1).innerHTML = "Avaliable";
            firstRow.insertCell(2).innerHTML = "Pointer";
            firstRow.insertCell(3).innerHTML = "Data";

            for(let m = 0; m < 4; m++){
                firstRow.cells.item(m).style.textAlign = "center";
                firstRow.cells.item(m).style.border = "1px solid black";
            }

            let index = 1;
            for(let i = 0; i < 4; i++){
                for(let j = 0; j< 8; j++){
                    for(let k = 0; k< 8; k++){
                        let toPutInRow = JSON.parse(sessionStorage.getItem(`${i}:${j}:${k}`));
                        //create row
                        let row = table.insertRow(index);
                        row.id = `${i}:${j}:${k}`;
                        row.insertCell(0).innerHTML = `${i}:${j}:${k}`;
                        row.insertCell(1).innerHTML = toPutInRow.availability.toString();
                        row.insertCell(2).innerHTML = `${toPutInRow.pointer[0]}:${toPutInRow.pointer[1]}:${toPutInRow.pointer[2]}`;
                        row.insertCell(3).innerHTML = toPutInRow.data;
                        index++;

                        //Styling
                        for(let m = 0; m < 4; m++){
                            row.cells.item(m).style.textAlign = "center";
                            row.cells.item(m).style.border = "1px solid black";
                        }
                    }
                }
            }
        }

        public updateHardDriveDisplay(rowID){
            let row: HTMLTableRowElement = <HTMLTableRowElement> document.getElementById(rowID);

            let updatedRow = JSON.parse(sessionStorage.getItem(rowID));
            row.insertCell(1).innerHTML = updatedRow.availability.toString(); 
            row.insertCell(2).innerHTML = `${updatedRow.pointer[0]}:${updatedRow.pointer[1]}:${updatedRow.pointer[2]}`;
            row.insertCell(3).innerHTML = updatedRow.data;

            for(let m = 0; m < 4; m++){
                row.cells.item(m).style.textAlign = "center";
                row.cells.item(m).style.border = "1px solid black";
            }
            console.log("hello");
        }
    }
}