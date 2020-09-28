module TSOS{
    export class DeviceDisplay{

        constructor() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpPCB();
        }

        public updateMemory(){
            let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');
            let index = 0;
            for (let i = 0; i < table.rows.length; i++) {
                for (let j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = _Memory.memoryThread[index].toString();
                    table.rows[i].cells.item(j).style['font-weight'] = "normal";
                    index++;
                }
            }
        }

        public startUpMemory(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');
            for (let i = 0; i < _Memory.memoryThread.length / 8; i++) {
                let row = table.insertRow(i);
                let address = i * 8;
                let first = row.insertCell(0);

                let memUnit = "0x";
                for (let j= 0; j < 3 - address.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += address.toString(16);
                first.innerHTML = memUnit;
                for (let k = 1; k < 9; k++) {
                    let cell = row.insertCell(k);
                    cell.innerHTML = "00";
                }
            }
        }

        public startUpCPU(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("cpu");
            let header = ["PC", "IR", "ACC", "X", "Y", "Z"];

            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = header[i];
            }
        }


        public updateCPU(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("cpu");

            let header = _CPU.returnCPU();
            let row = table.insertRow(1);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }

        }

        public startUpPCB(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");

            let header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];
            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
        }

        public updatePCB(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");

            let header = _PCB.returnPCB();
            let row = table.insertRow(0);
            for(let i = 0; i < header.length; i++){
                let next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
        }

    }
}