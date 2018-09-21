colorizer
---
Colorizer convert given value to equivalent color.

```javascript
const colorizer = require('@colorizer'),
  temperature = [-50, -10, 0, 20, 45, 80],
  dataSet = colorizer.convert(temperature);

//dataSet = [ '#6673FF', '#66FFD3', '#66FFA5', '#83FF66', '#F7FF66', '#FF6666' ]
```
in preceding example each element in dataSet array is an equivalent color of element in temperature array with the same index. Minimal temperature equal to blue color and maximum temperature equal to red.

__Also you can convert single value__
```javascript
const colorizer = require('@colorizer'),

colorizer.configuration({
  maxHue: 60, // color range from red to yellow. By default 235(blue)
  hue: 120, //base equal to saturation colorizer will be convert all value to color with hue=120 and equivalent saturation
  saturation: 100, //saturation of return color
  lightness: 70, //lightnessof return color
  minValue: 0,
  maxValue: 100,
  //you can set minValue and maxValue to convert single value to color
  reverse: true, //define color for min and max value. If reverse is true then min value equivalent to blue color and max to red
  color: 'hex', //return color in hex. You can set rgb or hsl
  base: 'color',//equate value to color. You can also set base to 'saturation' and equate value to color with set hue and equivalent saturation
  throwError: false, //You can not set hue more then 360 or set minValue more then maxValue. You can set throwError to false and if this case colorizer set appropriate value without throwing error. For example if you set saturation to 120 it will be implicit change to 100 without throwing console.error();
})
```

__Colorizer properties__

* __convert__
  >function takes array or number and return array of equivalent colors or single color
* __configuration__
  >function take an Object and change config of colorizer
* __minMax__
  >function take's two param and set min and max value of colorizer
  ```javascript
  const colorizer = require('@colorizer'),
    min = 10,
    max=120;

  colorizer.minMax(min, max).convert(25)
  ```
* __setHue__
  >function to set hue of colorizer;
  ```javascript
  const colorizer = require('@colorizer'),
    dataSet = [15, 0, 48, 52, 90, 32],
    colors = [];

  colorizer.configuration({base: 'saturation'});

  for(let i = 0; i < dataSet.length; i++) {

    if (i%2) {
      colors.push(colorizer.setHue(180).convert(dataSet[i]));
    } else {
      colors.push(colorizer.setHue(180).convert(dataSet[i]));
    }

  }
  ```
* __setSat__
  >function set saturation of colorizer
  ```javascript
  colorizer.setSat(25).convert([67, 25, 48, 92]);
  ```
* __setLight__
  >function set lightness of colorizer
  ```javascript
  colorizer.setLight(25).convert([67, 25, 48, 92]);
  ```
* __getValueOf__
  >function return current value of configuration key
  ```javascript
  colorizer.getValueOf('maxHue');
  ```
