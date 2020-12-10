var TSOS;
(function (TSOS) {
    var DeviceDisplay = /** @class */ (function () {
        function DeviceDisplay() {
            this.startUpMemory();
            this.startUpCPU();
            this.startUpSchedular();
        }
        DeviceDisplay.prototype.cycleReload = function () {
            this.updateCPU();
            this.updateSchedular();
            this.startUpMemory();
            this.updateReadyQueue();
        };
        DeviceDisplay.prototype.updateMemory = function () {
            var table = document.getElementById('memoryUnit');
            var index = 0;
            for (var i = 0; i < table.rows.length; i++) {
                for (var j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = _Memory.memoryThread[index].toString();
                    table.rows[i].cells.item(j).style['font-weight'] = "normal";
                    if (index === _CPU.PC) {
                        table.rows[i].cells.item(j).style.color = "magenta";
                    }
                    else {
                        table.rows[i].cells.item(j).style.color = "black";
                    }
                    index++;
                }
            }
        };
        DeviceDisplay.prototype.startUpMemory = function () {
            var table = document.getElementById('memoryUnit');
            var stringMemory = _Memory.memoryThread[0].concat(_Memory.memoryThread[1], _Memory.memoryThread[2]);
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var index = 0;
            var numberOfRows = stringMemory.length / 8;
            for (var i = 0; i < numberOfRows; i++) {
                var row = table.insertRow(i);
                var memAdress = i * 8;
                var first = row.insertCell(0);
                row.cells.item(0).style.textAlign = "center";
                row.cells.item(0).style.border = "1px solid black";
                var memUnit = "0x";
                for (var j = 0; j < 3 - memAdress.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += memAdress.toString(16);
                first.innerHTML = memUnit;
                for (var k = 1; k < 9; k++) {
                    var cell = row.insertCell(k);
                    cell.style.textAlign = "center";
                    cell.style.border = "1px solid black";
                    cell.innerHTML = stringMemory[index];
                    index++;
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
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
                next.innerHTML = header[i];
            }
            var row2 = table.insertRow(1);
            for (var j = 0; j < header.length; j++) {
                var next = row2.insertCell(j);
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
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
                next.style.textAlign = "center";
                next.style.border = "1px solid black";
                next.innerHTML = String(header[i]);
            }
        };
        DeviceDisplay.prototype.updateSchedular = function () {
            var table = document.getElementById("processeList");
            table.deleteRow(_PCB.PID + 1);
            var row = table.insertRow(_PCB.PID + 1);
            for (var i = 0; i < 9; i++) {
                row.insertCell(i).innerHTML = _Schedular.allProcesses[_PCB.PID][i];
            }
        };
        DeviceDisplay.prototype.startUpSchedular = function () {
            var table = document.getElementById("processeList");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var header = ["PID", "PC", "ACC", "X", "Y", "Z", "IR", "State", "Location", "P"];
            var row = table.insertRow(0);
            for (var i = 0; i < header.length; i++) {
                var next = row.insertCell(i);
                next.innerHTML = String(header[i]);
            }
            for (var i = 1; i < _MemoryAccessor.nextProgInMem + 2; i++) {
                var row_1 = table.insertRow(i);
                for (var j = 0; j < header.length; j++) {
                    row_1.insertCell(j).innerHTML = _Schedular.allProcesses[i - 1][j];
                }
            }
        };
        DeviceDisplay.prototype.updateReadyQueue = function () {
            var table = document.getElementById("readyQ");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var row = table.insertRow(0);
            row.insertCell(0).innerHTML = _Schedular.readyQueue.toString();
        };
        DeviceDisplay.prototype.hardDriveDisplay = function () {
            //Set the key equal to the row key
            var table = document.getElementById("hardDrive");
            while (table.hasChildNodes()) {
                table.removeChild(table.firstChild);
            }
            var firstRow = table.insertRow(0);
            firstRow.insertCell(0).innerHTML = "Key";
            firstRow.insertCell(1).innerHTML = "Avaliable";
            firstRow.insertCell(2).innerHTML = "Pointer";
            firstRow.insertCell(3).innerHTML = "Data";
            for (var m = 0; m < 4; m++) {
                firstRow.cells.item(m).style.textAlign = "center";
                firstRow.cells.item(m).style.border = "1px solid black";
            }
            var index = 1;
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var toPutInRow = JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k));
                        //create row
                        var row = table.insertRow(index);
                        row.id = i + ":" + j + ":" + k;
                        row.insertCell(0).innerHTML = i + ":" + j + ":" + k;
                        row.insertCell(1).innerHTML = toPutInRow.availability.toString();
                        row.insertCell(2).innerHTML = toPutInRow.pointer[0] + ":" + toPutInRow.pointer[1] + ":" + toPutInRow.pointer[2];
                        row.insertCell(3).innerHTML = toPutInRow.data.toString();
                        index++;
                        //Styling
                        for (var m = 0; m < 3; m++) {
                            row.cells.item(m).style.textAlign = "center";
                            row.cells.item(m).style.border = "1px solid black";
                        }
                        row.cells.item(3).style.border = "1px solid black";
                        row.cells.item(3).style.textAlign = "left";
                    }
                }
            }
        };
        DeviceDisplay.prototype.updateHardDriveDisplay = function (rowID) {
            var row = document.getElementById(rowID);
            var updatedRow = JSON.parse(sessionStorage.getItem(rowID));
            row.cells[1].innerHTML = updatedRow.availability.toString();
            row.cells[2].innerHTML = updatedRow.pointer[0] + ":" + updatedRow.pointer[1] + ":" + updatedRow.pointer[2];
            row.cells[3].innerHTML = updatedRow.data;
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
