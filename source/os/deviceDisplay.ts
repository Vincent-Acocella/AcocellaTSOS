module TSOS{
    export class DeviceDisplay{

        constructor() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpSchedular();
        }

        public highlightMemory(segment, PC){
            let stringMemory = _Memory.memoryThread[0].concat(_Memory.memoryThread[1],_Memory.memoryThread[2]);
            let newIndex = _MemoryAccessor.read(PC,segment);


            console.log(newIndex);

            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');




            //Change the new index value
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

                let memUnit = "0x";
                for (let j= 0; j < 3 - memAdress.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += memAdress.toString(16);
                first.innerHTML = memUnit;

                for (let k = 1; k < 9; k++) {
                    let cell = row.insertCell(k);
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
    }
}