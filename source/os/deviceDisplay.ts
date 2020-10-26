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
            let results = TSOS.Utils.bigBrainMaths(value);
            table.rows[results[0]].cells.item(results[1]).innerHTML = results[2];

            // let index = 0;
            // for (let i = 0; i < table.rows.length; i++) {
            //     for (let j = 1; j < 9; j++) {
            //         table.rows[i].cells.item(j).innerHTML = _Memory.memoryThread[currentSegment][index].toString();
            //         table.rows[i].cells.item(j).style['font-weight'] = "normal";
            //         if(index === _CPU.PC){
            //             table.rows[i].cells.item(j).style.color = "magenta";
            //         }else{
            //             table.rows[i].cells.item(j).style.color = "black";
            //         }
            //         index++;
            //     }
            // }
        }

        public startUpMemory(){
            let table: HTMLTableElement = <HTMLTableElement>document.getElementById('memoryUnit');
            this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2,_Memory.memoryThread3);
            console.log(_Memory.memoryThread[1].length);

            //3 segments
            let rowNumber = 0;
            for(let h = 0; h < 3; h++){
                for(let i = 0; i < _Memory.memoryThread[h].length;i=i+8){
                    let row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber*8);
                    for(let m = 1; m < 9; m++){
                        row.insertCell(m).innerHTML =_Memory.memoryThread[h][i + m-1];
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