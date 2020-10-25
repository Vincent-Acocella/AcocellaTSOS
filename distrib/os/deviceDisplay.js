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
            this.updateMemory();
            this.updateSchedular();
        };
        DeviceDisplay.prototype.updateMemory = function () {
            this.bigThread = [_Memory.memoryThread1, _Memory.memoryThread2, _Memory.memoryThread3];
            console.log(this.bigThread.length);
            var table = document.getElementById('memoryUnit');
            var index = 0;
            for (var i = 0; i < this.bigThread.length % 8; i++) {
                for (var j = 1; j < 9; j++) {
                    table.rows[i].cells.item(j).innerHTML = this.bigThread[index];
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
            this.bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
            console.log(this.bigThread.length);
            for (var i = 0; i < this.bigThread.length / 8; i++) {
                var row = table.insertRow(i);
                var memAdress = i * 8;
                var first = row.insertCell(0);
                var memUnit = "0x";
                for (var j = 0; j < 3 - memAdress.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += memAdress.toString(16);
                first.innerHTML = memUnit;
                for (var k = 1; k < 9; k++) {
                    var cell = row.insertCell(k);
                    cell.innerHTML = "00";
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
            //Look at schedule table
        };
        DeviceDisplay.prototype.updateSchedular = function () {
        };
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
