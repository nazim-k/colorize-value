const colorize = require('./index'),
    arr = colorize.convert([-50, 0, 20, 80]),
    v = colorize.minMax(-50, 80).convert(50);

colorize.configuration({color: 'hsl'});
console.log(colorize.getValueOf('color'));

console.log(arr);
console.log(v);