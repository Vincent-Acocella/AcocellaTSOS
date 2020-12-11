/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    var Queue = /** @class */ (function () {
        function Queue(q) {
            if (q === void 0) { q = new Array(); }
            this.q = q;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };
        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };
        Queue.prototype.enqueue = function (element) {
            this.q.push(element);
        };
        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        };
        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        };
        Queue.prototype.getCaboose = function () {
            var retVal = -1;
            if (this.q.length > 0) {
                for (var i = 0; i < this.q.length; i++) {
                    var x = this.dequeue();
                    if (i === this.q.length - 1) {
                        retVal = x;
                    }
                    this.enqueue(x);
                }
                return retVal;
            }
        };
        //Look at the first element in the queue
        Queue.prototype.peek = function () {
            var retVal = -1;
            if (this.q.length > 0) {
                for (var i = 0; i < this.q.length; i++) {
                    var x = this.dequeue();
                    if (i === 0) {
                        retVal = x;
                    }
                    this.enqueue(x);
                }
                return retVal;
            }
        };
        return Queue;
    }());
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
