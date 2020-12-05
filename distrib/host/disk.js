var TSOS;
(function (TSOS) {
    var Disk = /** @class */ (function () {
        function Disk(track, sector, block, data) {
            if (track === void 0) { track = 0; }
            if (sector === void 0) { sector = 0; }
            if (block === void 0) { block = 0; }
            if (data === void 0) { data = []; }
            this.track = track;
            this.sector = sector;
            this.block = block;
            this.data = data;
            this.track = 0;
            this.sector = 0;
            this.block = 0;
            this.dataInit();
        }
        Disk.prototype.dataInit = function () {
            for (var i = 0; i < 160; i++) {
                this.data[i] = "0";
            }
        };
        Disk.prototype.key = function () {
            return this.track + ": " + this.sector + ": " + this.block;
        };
        Disk.prototype.setAvalibility = function (aval) {
            this.data[0] = aval.toString();
        };
        Disk.prototype.getAvalibility = function () {
            return parseInt(this.data[0]);
        };
        Disk.prototype.setKey = function (track, sector, block) {
            this.track = track;
            this.sector = sector;
            this.block = block;
        };
        Disk.prototype.setPointer = function (pointer) {
            this.data[1] = pointer.charAt(0);
            this.data[2] = pointer.charAt(1);
            this.data[3] = pointer.charAt(2);
        };
        Disk.prototype.getPointer = function () {
            var pointer = [this.data[1], this.data[2], this.data[3]];
            return pointer;
        };
        Disk.prototype.storeInSession = function () {
            var diskAsJSON = {
                availability: this.getAvalibility(),
                pointer: this.getPointer(),
                data: this.data
            };
            return JSON.stringify(diskAsJSON);
        };
        return Disk;
    }());
    TSOS.Disk = Disk;
    //keys
    //0:0:0
    //3:7:7
    //0:0:1
    //0:0:7 directory
    //Initialize disk
})(TSOS || (TSOS = {}));
