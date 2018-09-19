module.exports = (function() {
    'use strict';
    // var maxHue = 340, saturation = 100, lightness = 100, range = {min: 0, max: 100},
    //     hidden = 'hiden value', rgb;
    const config = {
        maxHue: 235,
        hue: 120,
        saturation: 100,
        lightness: 70,
        minValue: 0,
        maxValue: 100,
        reverse: true,
        color: 'HEX',
        base: true
    };

    /**
     * inner variables
     */

    function converter(hue, sat, light) {

        var h = hue / 360, s = sat / 100, l = light / 100,
            r, g, b,
            q = l < 0.5 ? l * (1 + s) : l + s - l * s,
            p = 2 * l - q,
            result;

        function hexIt(c) {
            c = Math.round(c*255).toString(16).toUpperCase();
            return c.length > 1 ? c : '0' + c;

        }

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {

            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        switch (config.color) {
            case 'rgb':
                result = `rgb(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`;
                break;

            case 'hex':
                result = `hsl(${h*360}, ${s*100}%, ${l*100}%)`;
                break;

            default:
                result = `#${hexIt(r)}${hexIt(g)}${hexIt(b)}`;

        }

        return result

    }

    function getColor(value, maxValue, minValue) {
        const range = maxValue - minValue,
            { maxHue, hue, saturation, lightness, reverse, base } = config,
            k = base ? maxHue / range : 100 / range,
            cValue = reverse
                ? -k * (value - maxValue)
                : k * ( value - minValue ),
            color = base
                ? converter( cValue, saturation, lightness )
                : converter(hue, cValue, lightness);

        return color
    }

    function convert() {
        const args = Array.from(arguments);
        var maxValue, minValue, value, result;

        if (Array.isArray(args[0])) {
            maxValue = Math.max.apply(null, args[0]);
            minValue = Math.min.apply(null, args[0]);
            value = args[0];
            result = [];
            for (var i = 0; i < value.length; i+=1) {
                if (isNaN(value[i]))
                    throw new Error(`Convert only numbers. ${value[i]} in array ${value} is not a number`);
                result.push(getColor(value[i], maxValue, minValue))
            }
        } else {
            if (isNaN(args[0]))
                throw new Error(`Convert only numbers. Value ${value} is not a number`);

            maxValue = config.maxValue;
            minValue = config.minValue;
            if (args[0] < minValue || args[0] > maxValue)
                throw new Error(`Value ${args[0]} out of range ${minValue} ≤ value ≤ ${maxValue}`);
            value = args[0];
            result = getColor(value, maxValue, minValue);
        }

        return result
    }

    function minMax(min, max) {
        if (min >= max)
            throw new Error('min value should be less then max value');
        config.minValue = min;
        config.maxValue = max;
    }

    function setHue(hue) {
        if (hue < 0 || hue > 360)
            throw new Error(`Hue ${hue} out of range 0 ≤ hue ≤ 360`);
        config.hue = hue;
        return this
    }

    function setSat(sat) {
        if (sat < 0 || sat > 100)
            throw new Error(`Saturation ${sat} out of range 0 ≤ hue ≤ 100`);
        config.saturation = sat;
        return this
    }

    function setLight(light) {
        if (light < 0 || light > 100)
            throw new Error(`Saturation ${light} out of range 0 ≤ hue ≤ 100`);
        config.lightness = light;
        return this
    }

    function configuration(c) {
        for (let key in c) {
            switch (key) {
                case 'maxHue':
                    if (c.maxHue < 0 || c.maxHue > 360)
                        throw new Error(`Hue ${c.maxHue} out of range 0 ≤ hue ≤ 360`);
                    config.maxHue = c.maxHue;
                    break;

                case 'hue':
                    if (c.hue < 0 || c.hue > 360)
                        throw new Error(`Hue ${c.hue} out of range 0 ≤ hue ≤ 360`);
                    config.hue = c.hue;
                    break;

                case 'saturation':
                    if (c.saturation < 0 || c.saturation > 100)
                        throw new Error(`Saturation ${c.saturation} out of range 0 ≤ hue ≤ 100`);
                    config.saturation = c.saturation;
                    break;

                case 'lightness':
                    if (c.lightness < 0 || c.lightness > 100)
                        throw new Error(`Saturation ${c.lightness} out of range 0 ≤ hue ≤ 100`);
                    config.lightness = c.lightness;
                    break;

                case 'minValue':
                    if (c.minValue >= config.maxValue)
                        throw new Error('min value should be less then max value');
                    config.minValue = c.minValue;
                    break;

                case 'maxValue':
                    if (config.minValue >= c.maxValue)
                        throw new Error('max value should be over then min value');
                    config.maxValue = c.maxValue;
                    break;

                case 'reverse':
                    if (typeof c.reverse === 'boolean')
                        config.reverse = c.reverse;
                    break;

                case 'color':
                    if (c.color.toLowerCase() === 'rgb')
                        config.color = 'rgb';
                    else if (c.color.toLowerCase() === 'hsl')
                        config.color = 'hsl';
                    else config.color = 'hex';
                    break;

                case 'base':
                    if (c.base === 'color')
                        config.base = true;
                    else if (c.base === 'saturation')
                        config.base = false;
                    else throw new Error('base can be saturation either color');
                    break;

                default:
                    throw new Error(`There is no ${key} configuration`)
            }
        }
    }

    return {
        convert,
        configuration,
        minMax,
        setHue,
        setSat,
        setLight
    };

}());