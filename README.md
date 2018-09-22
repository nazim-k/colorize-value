colorizer
-
Colorizer convert given value to equivalent color and allow colorize charts or any html elements. You can set up colorizer to convert value into color as you need.

```javascript
const colorizer = require('colorize-value'),
  temperature = [-50, -10, 0, 20, 45, 80],
  dataSet = colorizer.convert(temperature);

//dataSet = [ '#6673FF', '#66FFD3', '#66FFA5', '#83FF66', '#F7FF66', '#FF6666' ]
```
in preceding example each element in dataSet array is an equivalent color of element in temperature array with the same index. Minimal temperature equal to blue color and maximum temperature equal to red. Also you can convert single value

Configuration of colorizer
-
```javascript
const colorizer = require('colorize-value'),

colorizer.configuration({
  maxColComp: 60,
  // set max value of opted color component(hue, saturation, lightness)
  minColComp: 0,
  // set min value of opted color component(hue, saturation, lightness)
  /*
  You can specify range of color component (hue, saturation, lightness)
  to convert value relative to this range.
  For example convert all value relative to range
  from red(minValue hue 0) to blue color (maxValue hue 235)
  */
  hue: 120,
  /*
  set up hue if you convert value to color
  using saturation or lightness
  */
  saturation: 100,
  /*
  set up saturation if you convert value to color
  using hue or lightness
  */
  lightness: 70,
  /*
  set up lightness if you convert value to color using hue or saturation
  */
  minValue: -60,
  maxValue: 100,
  /*
  To convert value relative to certain range
  you can set up minValue and maxValue of the range
  */
  reverse: true,
  /*
  If you want to equate maxColComp to minValue
  and minColComp to maxValue
  you can set up reverse to true.
  */
  color: 'hex',
  /*
  You can return color in deferent format(hsl, hex, rgb)
  */
  base: 'color',
  /*
  You can convert value using different color components,
  hue, saturation and lightness.
  */
  throwError: false,
  /*
  You can not set hue more then 360 or set minValue more then maxValue.
  And if you want to set appropriate value automatically
  without throwing an error, set up throwError property to false.
  For example if you set saturation to 120
  it will be implicit change to 100
  without throwing an error;
  */
  arrayBound: true,
  /*
  If you convert to color an array of values,
  minValue and maxValue correspond to min and max value in that array.
  But if you want to convert value relative to specific range
  you can set arrayBound to false.
  */
})
```

Colorizer properties
-

* __convert__
  >function takes array or number and return array of equivalent colors or single color
* __configuration__
  >function take an Object and change config of colorizer
* __minMax__
  >function take's two param and set min and max value of colorizer
  ```javascript
  const colorizer = require('colorize-value'),
    min = 10,
    max=120;

  const divColor = colorizer.minMax(min, max).convert(25)
  ```
* __setHue__
  >function to set hue of colorizer;
  ```javascript
  const colorizer = require('colorize-value'),
    dataSet = [15, 0, 48, 52, 90, 32],
    barChartcolors = [];

  colorizer.configuration({
    base: 'lightness',
    maxColComp: 85,
    minColComp: 45
  });

  for(let i = 0; i < dataSet.length; i++) {

    if (i%2) {
      colorizer.setHue(180);
    } else {
      colorizer.setHue(15);
    }

    barChartcolors.push(colorizer.convert(dataSet[i]))

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
* __setDefault__
  > function takes an object as a parameter and set up given config to default value. If you don't pass a parameter setDefault function will reset config to default
  ```javascript
  //Change default arrayBound: true;
  colorizer.setDefault({arrayBound: false}); // now arrayBound fasle by default

  colorizer.configuration({
    arrayBound: true,
    base: 'lightness',
  }); // change config

  colorizer.setDefault(); // reset to default config
  //base: 'color', arrayBound: false
  ```

Also you can chain _configuration, minMax, setHue, setSat, setLight_ properties.
