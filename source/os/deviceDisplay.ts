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
            this.updateMemory();
            this.updateSchedular();
        }

        public updateMemory(){
            this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');
            let index = 0;
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = this.bigThread[index];
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
            this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2,_Memory);

            for (let i = 0; i < this.bigThread.length / 8; i++) {
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
                    cell.innerHTML = "00";
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
            //Look at schedule table

        }
        public updateSchedular(){

        }
    }
}