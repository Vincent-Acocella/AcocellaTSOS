var TSOS;
(function (TSOS) {
    var DeviceDisplay = /** @class */ (function () {
        function DeviceDisplay() {
            this.bigThread = [];
            this.startUpMemory();
            this.startUpCPU();
            this.startUpPCB();
            this.startUpSchedular();
        }
        DeviceDisplay.prototype.reload = function () {
            this.bigThread = [];
            this.updatePCB();
            this.updateCPU();
            //this.updateMemory();
            this.updateSchedular();
        };
        // this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
        DeviceDisplay.prototype.updateMemory = function (value) {
            var table = document.getElementById('memoryUnit');
            //let results = TSOS.Utils.bigBrainMaths(value);
            var bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
            var currentSegment = _MemoryManager.segNum;
            //Index of the new value to be added to the table 
            //This was just updated
            //gets the row number
            var rowNum = ((currentSegment - 1) * 32 + Math.floor(value / 8));
            console.log(rowNum);
            var colNum = value % 8;
            console.log(colNum);
            var newValue = bigThread[(currentSegment - 1) * 256 + value];
            console.log(newValue);
            //copy row
            //delete row
            //add new cell
            //replace row
            var tempRow = [];
            for (var i = 0; i < 8; i++) {
                tempRow[i] = (colNum === i) ? tempRow[i] = newValue : tempRow[i] = table.rows[rowNum].cells[i];
            }
            table.deleteRow(rowNum);
            var row = table.insertRow(rowNum);
            for (var i = 0; i < 8; i++) {
                row.insertCell(i).innerHTML = tempRow[i];
            }
        };
        DeviceDisplay.prototype.startUpMemory = function () {
            var table = document.getElementById('memoryUnit');
            //this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2,_Memory.memoryThread3);
            //console.log(_Memory.memoryThread[1].length);
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            //3 segments
            for (var h = 0; h < 3; h++) {
                var i = 0;
                var rowNumber = h * 8;
                // let progSize = _MemoryAccessor.getSegmentToEndOfProg(h);
                var shift = 9;
                // let done = false;
                while (i < _Memory.memoryThread[h].length) {
                    var row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber * 8);
                    // if(progSize - i < 8){
                    //     shift = (progSize - i);
                    //     done = true;
                    // }
                    for (var m = 1; m < shift; m++) {
                        row.insertCell(m).innerHTML = "00";
                        i++;
                    }
                    // for(shift; shift < 9; shift++){
                    //     row.insertCell(shift).innerHTML = "00";
                    // }
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
        DeviceDisplay.prototype.startUpPCB = function () {
            var table = document.getElementById("pcb");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];
            var row = table.insertRow(0);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
            var row2 = table.insertRow(1);
            for (var i = 0; i < header.length; i++) {
                var next = row2.insertCell(i);
                next.innerHTML = "0";
            }
        };
        DeviceDisplay.prototype.updatePCB = function () {
            var table = document.getElementById("pcb");
            table.deleteRow(1);
            var header = _PCB.returnPCB();
            var row = table.insertRow(1);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
        };
        DeviceDisplay.prototype.startUpSchedular = function () {
            var table = document.getElementById("processeList");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var header = ["PID", "PC", "IR", "ACC", "X", "Y", "Z", "State", "Location"];
            var row = table.insertRow(0);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
            //Look at schedule table
        };
        DeviceDisplay.prototype.updateSchedular = function () {
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
