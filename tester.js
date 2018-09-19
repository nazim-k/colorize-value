const colorize = require('./index'),
    arr = colorize.convert([-50, 0, 20, 80]),
    v = colorize.minMax(-50, 80).convert(50);

console.log(arr);
console.log(v);