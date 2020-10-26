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
            var results = TSOS.Utils.bigBrainMaths(value);
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
        };
        DeviceDisplay.prototype.startUpMemory = function () {
            var table = document.getElementById('memoryUnit');
            this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
            console.log(_Memory.memoryThread[1].length);
            //3 segments
            var rowNumber = 0;
            for (var h = 0; h < 3; h++) {
                for (var i = 0; i < _Memory.memoryThread[h].length; i = i + 8) {
                    var row = table.insertRow(rowNumber);
                    row.insertCell(0).innerHTML = "0x" + TSOS.Utils.toHex(rowNumber * 8);
                    for (var m = 1; m < 9; m++) {
                        row.insertCell(m).innerHTML = _Memory.memoryThread[h][i + m - 1];
                    }
                    rowNumber++;
                }
            }
            // for (let i = 0; i < 768 / 8; i++) {
            //     let row = table.insertRow(i);
            //     let memAdress = i * 8;
            //     let first = row.insertCell(0);
            //     let memUnit = "0x";
            //     for (let j= 0; j < 3 - memAdress.toString(16).length; j++) {
            //         memUnit += "0";
            //     }
            //     memUnit += memAdress.toString(16);
            //     first.innerHTML = memUnit;
            //     for (let k = 1; k < 9; k++) {
            //         let cell = row.insertCell(k);
            //         cell.innerHTML = "00";
            //     }
            // }
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
            //Look at schedule table
        };
        DeviceDisplay.prototype.updateSchedular = function () {
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
