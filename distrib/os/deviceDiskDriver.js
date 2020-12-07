var TSOS;
(function (TSOS) {
    var DeviceDiskDriver = /** @class */ (function () {
        function DeviceDiskDriver(nextAvaliableBlock) {
            if (nextAvaliableBlock === void 0) { nextAvaliableBlock = 1; }
            this.nextAvaliableBlock = nextAvaliableBlock;
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
                _DeviceDisplay.hardDriveDisplay();
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
                var nextBlock = this.getNextAvaliableBlock();
                if (nextBlock > 0) {
                    var avaliableBlock = JSON.parse(sessionStorage.getItem("0:0:" + nextBlock));
                    avaliableBlock.availability = 1;
                    // NEED TO CLEAN OUT DATA IF DATA IS USED
                    if (avaliableBlock.data[0] !== "0") {
                        //Clear data
                        //Overwrite
                        var tempDisk = new TSOS.Disk;
                        avaliableBlock.data = tempDisk.data.slice(0);
                    }
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
                    sessionStorage.setItem("0:0:" + nextBlock, JSON.stringify(avaliableBlock));
                    //UPDATE TABLE
                    _DeviceDisplay.updateHardDriveDisplay("0:0:" + nextBlock);
                    return true;
                }
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
            if (search > 0) {
                var removingDisk = JSON.parse(sessionStorage.getItem("0:0:" + search));
                removingDisk.availability = 0;
                //check if a write occured on the file
                if (removingDisk.pointer[0] !== 0) {
                    //Remove Pointer
                    var removedPointer = JSON.parse(sessionStorage.getItem(removingDisk.pointer[0] + ":" + removingDisk.pointer[1] + ":" + removingDisk.pointer[2]));
                    removedPointer.availability = 0;
                    sessionStorage.setItem(removingDisk.pointer[0] + ":" + removingDisk.pointer[1] + ":" + removingDisk.pointer[2], JSON.stringify(removedPointer));
                    _DeviceDisplay.updateHardDriveDisplay(removingDisk.pointer[0] + ":" + removingDisk.pointer[1] + ":" + removingDisk.pointer[2]);
                }
                //Put back storage values
                sessionStorage.setItem("0:0:" + search, JSON.stringify(removingDisk));
                //UPDATE TABLE
                _DeviceDisplay.updateHardDriveDisplay("0:0:" + search);
                return true;
            }
            else {
                return false;
            }
        };
        DeviceDiskDriver.prototype.writeToFile = function (values) {
            var input = values.splice(0);
            //pinut 0 is the filename
            var search = this.searchForFileByName(input[0]);
            if (search > 0 && input[1].charAt(0) == '"' && input[input.length - 1].charAt(input[input.length - 1].length - 1) == '"') {
                //Remove "" 
                input[1] = input[1].substring(1);
                input[input.length - 1] = input[input.length - 1].substring(0, input[input.length - 1].length - 1);
                //Get file
                var fileToWriteTo = JSON.parse(sessionStorage.getItem("0:0:" + search));
                //See if pointer needs to be set
                if (fileToWriteTo.pointer[0] === 0) {
                    //Set pointer if needed
                    fileToWriteTo.pointer = this.setNextAvaliablePointer().slice(0);
                }
                // Get Pointer location
                var keyToWriteIn = JSON.parse(sessionStorage.getItem(fileToWriteTo.pointer[0] + ":" + fileToWriteTo.pointer[1] + ":" + fileToWriteTo.pointer[2]));
                // Clear out location to make room 
                if (keyToWriteIn.data[0] !== "0") {
                    //Clear data
                    //Overwrite
                    var tempDisk = new TSOS.Disk;
                    keyToWriteIn.data = tempDisk.data.slice(0);
                }
                //Add text to the key
                var dataIndex = 0;
                for (var i = 1; i < input.length; i++) {
                    for (var k = 0; k < input[i].length; k++) {
                        //Translate the write into hex and store
                        var hexCode = this.convertToHexByLetter(input[i].charCodeAt(k));
                        keyToWriteIn.data[dataIndex] = hexCode.charAt(0);
                        keyToWriteIn.data[dataIndex + 1] = hexCode.charAt(1);
                        dataIndex = dataIndex + 2;
                    }
                    if (i + 1 < input.length) {
                        //Add space when needed
                        var space = this.convertToHexByLetter(32);
                        keyToWriteIn.data[dataIndex] = space.charAt(0);
                        keyToWriteIn.data[dataIndex + 1] = space.charAt(1);
                        dataIndex = dataIndex + 2;
                    }
                }
                //Store back in
                sessionStorage.setItem("0:0:" + search, JSON.stringify(fileToWriteTo));
                sessionStorage.setItem(fileToWriteTo.pointer[0] + ":" + fileToWriteTo.pointer[1] + ":" + fileToWriteTo.pointer[2], JSON.stringify(keyToWriteIn));
                //UPDATE TABLES
                _DeviceDisplay.updateHardDriveDisplay("0:0:" + search);
                _DeviceDisplay.updateHardDriveDisplay(fileToWriteTo.pointer[0] + ":" + fileToWriteTo.pointer[1] + ":" + fileToWriteTo.pointer[2]);
                return true;
            }
            else {
                return false;
            }
        };
        DeviceDiskDriver.prototype.readFile = function (fileName) {
            var search = this.searchForFileByName(fileName);
            if (search > 0) {
                //Get file
                var directoryFile = JSON.parse(sessionStorage.getItem("0:0:" + search));
                //Use pointer to get next file
                //if no pointer then no write exists 
                if (directoryFile.pointer[0] !== 0) {
                    var fileToRead = JSON.parse(sessionStorage.getItem(directoryFile.pointer[0] + ":" + directoryFile.pointer[1] + ":" + directoryFile.pointer[2]));
                    //Get data from file
                    var output = this.convertToTextFromHex(fileToRead.data);
                    //Return String with info 
                    return output;
                }
                else {
                    return "Nothing to read in " + fileName;
                }
            }
            else {
                return "Could not find file with name " + fileName;
            }
        };
        //--------------------------------------------------------------------------------------------
        // UTILITIES DOSAKODKJOSAKDOKSODKOASDKOK
        DeviceDiskDriver.prototype.convertToTextFromHex = function (data) {
            var output = '';
            //array is imputted 
            var next;
            var index = 0;
            while (next !== "0") {
                var hexVal = data[index] + data[index + 1];
                output += this.convertFromHexByLetter(hexVal);
                index = index + 2;
                next = data[index];
            }
            //loop through and convert each hex character to characters
            return output;
        };
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
        DeviceDiskDriver.prototype.getNextAvaliableBlock = function () {
            for (var i = 1; i < 8; i++) {
                if (JSON.parse(sessionStorage.getItem("0:0:" + i)).availability === 0) {
                    return i;
                }
            }
            return -1;
        };
        DeviceDiskDriver.prototype.setNextAvaliablePointer = function () {
            for (var i = 1; i < 4; i++) {
                for (var j = 0; j < 8; j++) {
                    for (var k = 0; k < 8; k++) {
                        var nextPoint = JSON.parse(sessionStorage.getItem(i + ":" + j + ":" + k));
                        if (nextPoint.availability === 0) {
                            nextPoint.availability = 1;
                            sessionStorage.setItem(i + ":" + j + ":" + k, JSON.stringify(nextPoint));
                            return [i, j, k];
                        }
                    }
                }
            }
        };
        DeviceDiskDriver.prototype.convertFromHexByLetter = function (hexVal) {
            return String.fromCharCode(parseInt(hexVal, 16));
        };
        DeviceDiskDriver.prototype.convertToHexByLetter = function (char) {
            return char.toString(16);
        };
        return DeviceDiskDriver;
    }());
    TSOS.DeviceDiskDriver = DeviceDiskDriver;
})(TSOS || (TSOS = {}));
