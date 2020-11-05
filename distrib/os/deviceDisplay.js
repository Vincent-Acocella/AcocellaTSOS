var TSOS;
(function (TSOS) {
    var DeviceDisplay = /** @class */ (function () {
        function DeviceDisplay() {
            this.startUpMemory();
            this.startUpCPU();
            //this.startUpPCB();
        }
        DeviceDisplay.prototype.reload = function () {
            //  this.updatePCB();
            this.updateCPU();
        };
        DeviceDisplay.prototype.updateMemory = function (segment, PC) {
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
                var memUnit = "0x";
                for (var j = 0; j < 3 - memAdress.toString(16).length; j++) {
                    memUnit += "0";
                }
                memUnit += memAdress.toString(16);
                first.innerHTML = memUnit;
                for (var k = 1; k < 9; k++) {
                    var cell = row.insertCell(k);
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
        return DeviceDisplay;
    }());
    TSOS.DeviceDisplay = DeviceDisplay;
})(TSOS || (TSOS = {}));
