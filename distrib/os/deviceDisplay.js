var TSOS;
(function (TSOS) {
    var DeviceDisplay = /** @class */ (function () {
        function DeviceDisplay() {
            this.bigThread = [];
            this.startUpMemory();
            this.startUpCPU();
            this.startUpSchedular();
        }
        DeviceDisplay.prototype.reload = function () {
            this.bigThread = [];
            //this.updatePCB();
            //his.updateCPU();
            //this.updateMemory();
            // this.updateSchedular();
        };
        DeviceDisplay.prototype.updateMemory = function (index, seg) {
            //index is the spot in memory
            var table = document.getElementById('memoryUnit');
            var rowNum = ((seg - 1) * 32 + Math.floor(index / 8));
            var colNum = index % 8;
            var newValue = _Memory.memoryThread[_MemoryAccessor.currentSegment];
            table.deleteRow(rowNum);
            var row = table.insertRow(rowNum);
            for (var i = rowNum; i < rowNum + 8; i++) {
                if (i === colNum) {
                    row.insertCell(i).innerHTML = newValue;
                }
                else {
                    row.insertCell(i).innerHTML = _Memory.memoryThread[rowNum][i];
                }
            }
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
            for (var i = 1; i < 8; i++) {
                var row_1 = table.insertRow(i);
                for (var j = 0; j < header.length; j++) {
                    row_1.insertCell(j).innerHTML = "";
                }
            }
            //Look at schedule table
        };
        DeviceDisplay.prototype.updateSchedular = function (PID) {
            var table = document.getElementById("processeList");
            table.deleteRow(PID + 1);
            var row = table.insertRow(PID + 1);
            for (var j = 0; j < 9; j++) {
                row.insertCell(j).innerHTML = _Schedular.allProcesses[PID][j];
            }
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
