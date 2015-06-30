/**
 * This file contains a class that provides functionality to filter log messages
 * by wrapping console.log. use it like this:
 *
 * console.log = require(./filtered_log)
 */
__log = console.log;
module.exports =  function () {
    var args = Array.prototype.slice.call(arguments, 0);
    if (args[0] && (
      /cannot\sreason/gi.test(args[0])
      ||
      /Warning/gi.test(args[0])
    )) return;
    __log.apply(console, args);
};
