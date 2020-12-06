var TSOS;
(function (TSOS) {
    var DeviceDiskDriver = /** @class */ (function () {
        function DeviceDiskDriver(nextAvaliableBlock, currentPointer) {
            if (nextAvaliableBlock === void 0) { nextAvaliableBlock = 1; }
            if (currentPointer === void 0) { currentPointer = [1, 0, 0]; }
            this.nextAvaliableBlock = nextAvaliableBlock;
            this.currentPointer = currentPointer;
        }
        /*

        |     Key   |   Value   |
        |_______________________|
        |           |           |
        |     000   |     001   | Current
        |           |      002  | current
        |           |           |
        |           |           |


        Flow

        Create:
        Use Current Pointer
        *Sets*
        Set current to pointer
        Iterate nextPointer up

        Delete:
        current is put on spot
        Next remains the same

        WOAH DOUBLE DELETE HOW DO WE KNOW

        if current is avaliable than set nextPointer here

        AHHHHHHH TRIPPLE DELETE

        if next is less than new spot do nothing
 -------------------------------------------------------------------
        SO THE RULES ARE AS FOLLOWS
        On create:
        - Set current (It will be up to date)
        - set current to next
        - Look for next if next is avaliable go to that
            - If no next set current to -1

        On delete:
        - if current is before delete no nothing.
        - if next is before do nothing
        
        - If delete index is before current,
            -  check current status.
                - If in use then set current status to deleted index (Leave next)
                - If current status is not used set next to current and current to deleted index

        - if current is before but delete is after
            - leave current move next to deleted

        Max 7 in Memory
        */
        DeviceDiskDriver.prototype.init = function () {
        };
        //--------------------------------------------------------------
        //Called in shell
        DeviceDiskDriver.prototype.formatDisk = function () {
            //directory
            var index = 0;
            if (sessionStorage.getItem('0:0:0') === null) {
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
                _FORMATTED = true;
                return true;
            }
            return false;
        };
        //--------------------------------------------------------------     
        //Called in shell
        DeviceDiskDriver.prototype.createFile = function (fileName) {
            //to create a file we put the name in hex (if it doesn't already exist) in the data at the next avaliable spot
            if (this.searchForFileByName(fileName) < 0) {
                var avaliableBlock = JSON.parse(sessionStorage.getItem("0:0:" + this.nextAvaliableBlock));
                avaliableBlock.availability = 1;
                // NEED TO CLEAN OUT DATA IF DATA IS USED
                //Assign the name to the file
                var dataIndex = 0;
                for (var i = 0; i < fileName.length; i++) {
                    var value = this.convertToHexByLetter(fileName.charCodeAt(i));
                    if (value.length > 1) {
                        avaliableBlock.data[dataIndex] = value.charAt(0);
                        avaliableBlock.data[dataIndex + 1] = value.charAt(1);
                        dataIndex = dataIndex + 2;
                    }
                    else {
                        avaliableBlock.data[dataIndex] = fileName.charAt(0);
                        dataIndex++;
                    }
                }
                //Set the item
                sessionStorage.setItem("0:0:" + this.nextAvaliableBlock, JSON.stringify(avaliableBlock));
                this.setNextAvaliableBlock();
                return true;
            }
            else {
                return false;
            }
        };
        //--------------------------------------------------------------
        //Called in shell
        DeviceDiskDriver.prototype.deleteFile = function (fileName) {
            fileName = fileName.toString();
            //clear filename and set avaliability to 0
            //set next avaliable to index
            var search = this.searchForFileByName(fileName);
            console.log(search);
            if (search > 0) {
                var removingDisk = JSON.parse(sessionStorage.getItem("0:0:" + search));
                removingDisk.availability = 0;
                //check if a write occured on the file
                if (removingDisk.pointer[0] !== 0) {
                    //Remove Pointer
                    var removedPointer = JSON.parse(sessionStorage.getItem(removingDisk.pointer[1] + ":" + removingDisk.ponter[2] + ":" + removingDisk.pointer[3]));
                    removedPointer.availability = 0;
                    //Update next avaliable if needed
                    if (search < this.nextAvaliableBlock) {
                        this.nextAvaliableBlock = search;
                    }
                    //Update pointer if needed
                    var flag = false;
                    var i = 0;
                    while (!flag) {
                        switch (this.locateNextPointerOnDelete(removingDisk.pointer[i], this.currentPointer[i])) {
                            case 0:
                                //Equal continue search
                                break;
                            case 1:
                                //Stop less than is better
                                this.currentPointer = removedPointer.pointer.slice(0);
                                flag = true;
                                break;
                            //Deleted is ahead of next
                            case 2:
                                flag = true;
                                break;
                        }
                        i++;
                    }
                    sessionStorage.setItem(removingDisk.pointer[1] + ":" + removingDisk.pointer[2] + ":" + removingDisk.pointer[3], JSON.stringify(removedPointer));
                }
                //Put back storage values
                sessionStorage.setItem("0:0:" + search, JSON.stringify(removingDisk));
                return true;
            }
            else {
                return false;
            }
        };
        DeviceDiskDriver.prototype.writeToFile = function (values) {
            var input = values.splice(0);
            console.log(input);
            //seperate input 
            //0 is the file name
            var search = this.searchForFileByName(input[0]);
            if (search > 0 && input[1].charAt(0) == '"' && input[input.length - 1].charAt(input[input.length - 1].length - 1) == '"') {
                //Remove "" 
                input[1] = input[1].substring(1);
                input[input.length - 1] = input[input.length - 1].substring(0, input[input.length - 1].length - 1);
                console.log(input[1]);
                // //Get file
                // let fileToWriteTo = JSON.parse(sessionStorage.getItem(`0:0:${search}`));
                // //Set pointer
                // fileToWriteTo.pointer = this.currentPointer.slice(0);
                // //Get Pointer location
                // let keyToWriteIn = JSON.parse(sessionStorage.getItem(`${fileToWriteTo.pointer[0]}:${fileToWriteTo.pointer[1]}:${fileToWriteTo[2]}`));
                // //Clear out location to make room 
                // if(keyToWriteIn.data[0] != "0"){
                //     //Clear data
                //     let tempDisk = new Disk;
                //     keyToWriteIn.data = tempDisk.data.slice(0)
                // }
                // let dataIndex = 0;
                //Get correct argument
                // //Translate the write into hex
                // //Write to file
                return true;
            }
            else {
                return false;
            }
        };
        //-----------------------------------------------------------------------------------
        DeviceDiskDriver.prototype.searchForFileByName = function (fileName) {
            //return the filename and the JSON with it 
            //if not return false
            for (var i = 1; i < 8; i++) {
                //iterate thru directory
                var next = 0;
                var block = JSON.parse(sessionStorage.getItem("0:0:" + i));
                //if avaliable check if the names match
                if (block.availability === 1) {
                    var flag = true;
                    for (var j = 0; j < fileName.length; j++) {
                        //compare by letter if one doesnt match break
                        var value = this.convertToHexByLetter(fileName.charCodeAt(j));
                        if (value.length > 1) {
                            if (block.data[next] !== value.charAt(0) && block.data[next] !== value.charAt(1)) {
                                flag = false;
                            }
                            next = next + 2;
                        }
                        else {
                            if (block.data[next] !== value.charAt(0)) {
                                flag = false;
                            }
                            next++;
                        }
                    }
                    if (flag) {
                        //we found a match!!!
                        return i;
                    }
                }
            }
            return -1;
        };
        DeviceDiskDriver.prototype.setNextAvaliableBlock = function () {
            var next = 1;
            while ((next + this.nextAvaliableBlock < 8) && JSON.parse(sessionStorage.getItem("0:0:" + (this.nextAvaliableBlock + next))).availability === 0) {
                next++;
            }
            this.nextAvaliableBlock === this.nextAvaliableBlock + next;
        };
        DeviceDiskDriver.prototype.locateNextPointerOnDelete = function (deletedValue, currentNext) {
            if (deletedValue === currentNext) {
                return 0;
            }
            else if (deletedValue < currentNext) {
                return 1;
            }
            else {
                return 2;
            }
        };
        DeviceDiskDriver.prototype.setNextAvaliablePointer = function () {
            loop1: for (var i = 1; i < 4; i++) {
                for (var j = 0; j < 8; i++) {
                    for (var k = 0; k < 8; k++) {
                        var nextPoint = JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k));
                        if (nextPoint.avaliability === 0) {
                            this.currentPointer = nextPoint.slice(1, 4);
                            break loop1;
                        }
                        console.log("Hello");
                    }
                }
            }
        };
        DeviceDiskDriver.prototype.convertWordFromHexByLetter = function (filename) {
            var newStr;
            for (var i = 1; i <= filename.length; i++) {
                newStr += filename.charCodeAt(i).toString(16);
            }
            return newStr;
        };
        DeviceDiskDriver.prototype.convertToHexByLetter = function (char) {
            return char.toString(16);
        };
        ;
        return DeviceDiskDriver;
    }());
    TSOS.DeviceDiskDriver = DeviceDiskDriver;
})(TSOS || (TSOS = {}));
