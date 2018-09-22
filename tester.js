const colorizer = require('./index'),
    arr = colorizer.convert([-50, -10, 0, 20, 45, 80]),
    v = colorizer.minMax(-50, 80).convert(50);


console.log(arr);
console.log(v);

colorizer.configuration({
    arrayBound: false,
    maxValue: 150,
    minValue: -100
});
console.log(colorizer.getValueOf('arrayBound'));
console.log(colorizer.convert([-50, -10, 0, 20, 45, 80]));

colorizer.configuration({
    maxValue: 100,
    minValue: 0,
    maxColComp: 100,
    minColComp: 45,
    hue: 15,
    saturation: 85,
    base: 'lightness',
});

console.log(colorizer.convert(50));

colorizer.setDefault();

console.log(colorizer.getValueOf('arrayBound'));