var TSOS;
(function (TSOS) {
    var DeviceDiskDriver = /** @class */ (function () {
        function DeviceDiskDriver(nextAvaliableBlock) {
            if (nextAvaliableBlock === void 0) { nextAvaliableBlock = 1; }
            this.nextAvaliableBlock = nextAvaliableBlock;
        }
        DeviceDiskDriver.prototype.init = function () {
        };
        DeviceDiskDriver.prototype.formatDisk = function () {
            //directory
            var index = 0;
            if (sessionStorage.getItem('0:0;0') === null) {
                //First instance is always in use
                //used to hold next aval
                //take SingleDiskclass
                for (var i = 0; i <= 3; i++) {
                    for (var k = 0; k <= 7; k++) {
                        for (var j = 0; j <= 7; j++) {
                            var newDisk = new TSOS.Disk;
                            if (index === 0)
                                newDisk.setAvalibility(1);
                            sessionStorage.setItem(i + ":" + k + ":" + j, newDisk.storeInSession());
                            index++;
                        }
                    }
                }
                return true;
            }
            return false;
        };
        DeviceDiskDriver.prototype.createFile = function (fileName) {
            fileName = fileName.toString();
            //to create a file we put the name in hex (if it doesn't already exist) in the data at the next avaliable spot
            if (this.checkOut(fileName)) {
                console.log(this.nextAvaliableBlock);
                var avaliableBlock = JSON.parse(sessionStorage.getItem("0:0:" + this.nextAvaliableBlock));
                avaliableBlock.data[0] = "1";
                avaliableBlock.avalibility = 1;
                var dataIndex = 4;
                for (var i = 0; i < fileName.length; i++) {
                    var value = this.convertToHexByLetter(fileName.charCodeAt(i));
                    if (value.length > 1) {
                        avaliableBlock.data[dataIndex] = value.charAt(0);
                        avaliableBlock.data[dataIndex + 1] = value.charAt(1);
                        dataIndex = dataIndex + 2;
                    }
                    else {
                        avaliableBlock.data[dataIndex] = value;
                        dataIndex++;
                    }
                }
                console.log(avaliableBlock.data);
            }
        };
        DeviceDiskDriver.prototype.updateNextAvaliable = function (val) {
            if (val < this.nextAvaliableBlock) {
                this.nextAvaliableBlock = val;
            }
        };
        DeviceDiskDriver.prototype.getNextAvaliable = function () {
        };
        DeviceDiskDriver.prototype.convertToHexByLetter = function (charCode) {
            console.log(charCode.toString(16));
            return charCode.toString(16);
        };
        DeviceDiskDriver.prototype.checkOut = function (str) {
            //make sure avaliable exists
            //make sure no names match
            for (var i = 0; i < 8; i++) {
            }
            return true;
        };
        return DeviceDiskDriver;
    }());
    TSOS.DeviceDiskDriver = DeviceDiskDriver;
})(TSOS || (TSOS = {}));
