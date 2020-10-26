/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) { // We need to cast the string to any for use in the for...in construct.
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        Utils.toHex = function (num) {
            return Utils.padStart(num.toString(16).toUpperCase(), "0", 2);
        };
        Utils.padStart = function (str, padWith, padTo) {
            var result = str;
            for (var i = 0; i < padTo - str.length; i++) {
                result = padWith + result;
            }
            return result;
        };
        Utils.bigBrainMaths = function (value) {
            var bigThread = _Memory.memoryThread1.concat(_Memory.memoryThread2, _Memory.memoryThread3);
            var currentSegment = _MemoryAccessor.currentSegment;
            //Index of the new value to be added to the table 
            //This was just updated
            //gets the row number
            var rowNum = Math.floor(((currentSegment - 1) * 32 + value) / 8);
            var colNum = value % 8;
            var newValue = bigThread[(currentSegment - 1) * 32 + value];
            return [rowNum, colNum, newValue];
        };
        return Utils;
    }());
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
