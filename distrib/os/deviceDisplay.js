var TSOS;
(function (TSOS) {
    var DeviceDisplay = /** @class */ (function () {
        function DeviceDisplay() {
            this.bigThread = [];
            this.startUpMemory();
            this.startUpCPU();
            //this.startUpPCB();
            this.startUpSchedular();
        }
        DeviceDisplay.prototype.reload = function () {
            this.bigThread = [];
            //this.updatePCB();
            this.updateCPU();
            //this.updateMemory();
            this.updateSchedular();
        };
        DeviceDisplay.prototype.updateMemory = function (index) {
            // let table: HTMLTableElement = <HTMLTableElement> document.getElementById('memoryUnit');
            // let currentSegment = _MemoryManager.segNum;
            // let rowNum = ((currentSegment-1) * 32 + Math.floor(index/8));
            // console.log(rowNum);
            // let colNum = index % 8;
            // console.log(colNum);
            //let newValue = _Memory.memoryThread[currentSegment][index];
            //console.log("Value: " + newValue + " Is being added at Index: " + index);
            // table.rows[rowNum].cells.item(colNum).innerHTML = newValue.toString();
        };
        DeviceDisplay.prototype.startUpMemory = function () {
            var table = document.getElementById('memoryUnit');
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            for (var h = 0; h < 3; h++) {
                var i = 0;
                var rowNumber = h * 8;
                var shift = 9;
                while (i < _Memory.memoryThread[h].length) {
                    var row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber * 8);
                    for (var m = 1; m < shift; m++) {
                        row.insertCell(m).innerHTML = "00";
                        i++;
                    }
                    rowNumber++;
                }
            }
        };
        DeviceDisplay.prototype.startUpCPU = function () {
            var table = document.getElementById("cpu");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var header = ["PC", "IR", "ACC", "X", "Y", "Z"];
            var row = table.insertRow(0);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = header[i];
            }
            var row2 = table.insertRow(1);
            for (var j = 0; j < header.length; j++) {
                var next = row2.insertCell(j);
                next.innerHTML = "0";
            }
        };
        DeviceDisplay.prototype.updateCPU = function () {
            var table = document.getElementById("cpu");
            table.deleteRow(1);
            var header = _CPU.returnCPU();
            var row = table.insertRow(1);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
        };
        // public startUpPCB(){
        //     let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");
        //     while(table.hasChildNodes())
        //     {
        //         table.removeChild(table.firstChild);
        //     }
        //     let header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];
        //     let row = table.insertRow(0);
        //     for(let i = 0; i < header.length; i++){
        //         let next = row.insertCell(i);
        //         next.innerHTML = String(header[i]);
        //     }
        //     let row2 = table.insertRow(1);
        //     for(let i = 0; i < header.length; i++){
        //         let next = row2.insertCell(i);
        //         next.innerHTML = "0";
        //     }
        // }
        // public updatePCB(value){
        //     let table: HTMLTableElement = <HTMLTableElement>document.getElementById("pcb");
        //     table.deleteRow(1);
        //     let header = _Schedular.allProcesses[value];
        //     let row = table.insertRow(1);
        //     for(let i = 0; i < header.length; i++){
        //         let next = row.insertCell(i);
        //         next.innerHTML = String(header[i]);
        //     }
        // }
        DeviceDisplay.prototype.startUpSchedular = function () {
            var table = document.getElementById("processeList");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var header = ["PID", "PC", "ACC", "X", "Y", "Z", "IR", "State", "Location"];
            var row = table.insertRow(0);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
            //Look at schedule table
        };
        DeviceDisplay.prototype.updateSchedular = function () {
            var table = document.getElementById("processeList");
            for (var i = 1; i < _Schedular.processesInSchedular; i++) {
                table.deleteRow(i);
                var row = table.insertRow(i);
                for (var j = 0; j < 9; j++) {
                    row.insertCell(j).innerHTML = _Schedular.allProcesses[i][j];
                }
            }
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
