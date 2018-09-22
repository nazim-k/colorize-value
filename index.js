const colorizer = (function() {
    'use strict';
    const config = {
        _maxColComp: 235,
        _minColComp: 0,
        _hue: 120,
        _saturation: 100,
        _lightness: 70,
        _minValue: 0,
        _maxValue: 100,
        _reverse: true,
        _color: 'hex',
        _base: 'color',
        _throwError: false,
        _arrayBound: true,
        _default: {
            maxColComp: 235,
            minColComp: 0,
            hue: 120,
            saturation: 100,
            lightness: 70,
            minValue: 0,
            maxValue: 100,
            reverse: true,
            color: 'hex',
            base: 'color',
            throwError: false,
            arrayBound: true,
        },
        get maxColComp() { return this._maxColComp },
        set maxColComp(maxColComp) {
            var max = this._base === 'color' ? 360 : 100;
            this._maxColComp = maxColComp > this._minColComp
                ? validate(maxColComp, 0, max)
                : this._maxColComp
        },
        get minColComp() { return this._minColComp },
        set minColComp(minColComp) {
            var max = this._base === 'color' ? 360 : 100;
            this._minColComp = minColComp < this._maxColComp
                ? validate(minColComp, 0, max)
                : this._minColComp
        },
        get hue() { return this._hue },
        set hue(hue) { this._hue = validate(hue, 0, 360) },
        get saturation() { return this._saturation },
        set saturation(s) { this._saturation = validate(s, 0, 100)},
        get lightness() { return this._lightness },
        set lightness(l) { this._lightness = validate(l, 0, 100)},
        get minValue() { return this._minValue },
        set minValue(min) { this._minValue = min < this._maxValue ? min : this._minValue },
        get maxValue() { return this._maxValue },
        set maxValue(max) { this._maxValue = max > this._minValue ? max : this._maxValue },
        get reverse() { return this._reverse },
        set reverse(bool) { this._reverse = typeof bool === 'boolean' ? bool : this._reverse },
        get color() { return this._color },
        set color(c) { c = c.toLowerCase(); this._color = !~['rgb', 'hex', 'hsl'].indexOf() ? this._color : c },
        get base() { return this._base },
        set base(b) {
            var max;
            b = b.toLowerCase();
            this._base = !~['color', 'saturation', 'lightness'].indexOf(b) ? this._base : b;
            max = this._base === 'color' ? 360 : 100;
            if (this._maxColComp > max) this._maxColComp = max;
            if (this._minColComp > this._maxColComp) this._minColComp = 0;
        },
        get throwError() { return this._throwError },
        set throwError(bool) { this._throwError = typeof bool === 'boolean' ? bool : this._throwError },
        get arrayBound() { return this._arrayBound },
        set arrayBound(bool) { this._arrayBound = typeof bool === 'boolean' ? bool : this._arrayBound },
        get default () { return this._default },
        set default (settings) {
            for (let key in settings) {
                if (this.hasOwnProperty(key))
                    this[key] = settings[key];
            }
        }
    }, clrzr = {};

    function validate(value, min, max) {
        if ( typeof value !== 'number' ) return;
        return value < min ? min : value > max ? max : value;
    }

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

            case 'hls':
                result = `hsl(${h*360}, ${s*100}%, ${l*100}%)`;
                break;

            default:
                result = `#${hexIt(r)}${hexIt(g)}${hexIt(b)}`;

        }

        return result

    }

    function getColor(value, maxValue, minValue) {
        if (value > maxValue || value < minValue) throw Error(`Value ${value} out of range ${minValue} ≤ v ≤ ${maxValue}`);
        const range = maxValue - minValue,
            { maxColComp, minColComp, hue, saturation, lightness, reverse, base } = config,
            k = (maxColComp - minColComp) / range,
            cValue = reverse
                ? maxColComp - k * ( value - minValue )
                : minColComp + k * ( value - minValue ),
            color = base === 'color'
                ? converter( cValue, saturation, lightness )
                : base === 'saturation'
                ? converter(hue, cValue, lightness)
                : converter(hue, saturation, cValue);

        return color
    }

    function convert() {
        const args = Array.from(arguments);
        var maxValue, minValue, value, result;

        if (Array.isArray(args[0])) {
            maxValue = config.arrayBound ? Math.max.apply(null, args[0]) : config.maxValue;
            minValue = config.arrayBound ? Math.min.apply(null, args[0]) : config.minValue;
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
        if (config.throwError && min >= max)
            throw new Error('min value should be less then max value');
        config.minValue = min;
        config.maxValue = max;
        return this
    }

    function setBoundary(min, max) {
        var upperBound = base === 'color' ? 360 : 100;
        if (config.throwError && (hue < 0 || hue > upperBound))
            throw new Error(`min ${min} and max ${max} out of range 0 ≤ hue ≤ ${upperBound}`);
        config.minColComp = min;
        config.maxColComp = max;
        return this
    }

    function setHue(hue) {
        if (config.throwError &&  (hue < 0 || hue > 360))
            throw new Error(`Hue ${hue} out of range 0 ≤ hue ≤ 360`);
        config.hue = hue;
        return this
    }

    function setSat(sat) {
        if (config.throwError && (sat < 0 || sat > 100))
            throw new Error(`Saturation ${sat} out of range 0 ≤ hue ≤ 100`);
        config.saturation = sat;
        return this
    }

    function setLight(light) {
        if (config.throwError && (light < 0 || light > 100))
            throw new Error(`Saturation ${light} out of range 0 ≤ hue ≤ 100`);
        config.lightness = light;
        return this
    }

    function configuration(c) {
        if (config.throwError) {
            if (typeof c === 'object') throw new Error('Config should be an Object');
            var max = base === 'color' ? 360 : 100;
            for (let key in c) {
                switch (key) {
                    case 'maxColComp':
                        if (c.maxColComp < 0 || c.maxColComp > max)
                            throw new Error(`Hue ${c.maxColComp} out of range 0 ≤ hue ≤ ${max}`);
                        config.maxColComp = c.maxColComp;
                        break;

                    case 'minColComp':
                        if (c.minColComp < 0 || c.minColComp > max)
                            throw new Error(`${base} color component ${c.minColComp} out of range 0 ≤ hue ≤ ${max}`);
                        config.minColComp = c.minColComp;
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
                        if(!~['rgb', 'hsl', 'hex'].indexOf(c.color.toLowerCase()))
                            throw new Error(`There is no color schema ${c.color.toLowerCase}`);
                        config.color = c.color;
                        break;

                    case 'base':
                        if (!~['color', 'saturation', 'hue'].indexOf(c.base.toLowerCase()))
                            throw new Error('base can be saturation either color');
                        config.base = c.base;
                        break;

                    case 'throwError':
                        if (typeof c.throwError !== 'boolean')
                            throw new Error('throwError should be a boolean type');
                        config.throwError = c.throwError;

                    case 'arrayBound':
                        if (typeof c.arrayBound !== 'boolean')
                            throw new Error('arrayBound should be a boolean type');
                        config.arrayBound = c.arrayBound;

                    default:
                        throw new Error(`There is no ${key} configuration`)
                }
            }
        } else {
            for (let key in c) {
                if (config.hasOwnProperty(key))
                    config[key] = c[key]
            }
        }

        return this

    }

    function getValueOf(v) {
        return config[v]
    }

    function setDefault(settings) {
        settings = typeof settings === 'object'
            ? settings
            : config.default;

        config.default = settings;
    }

    Object.defineProperties(clrzr, {
        convert: {value: convert, writable: false, configurable: false},
        configuration: {value: configuration, writable: false, configurable: false},
        minMax: {value: minMax, writable: false, configurable: false},
        setHue: {value: setHue, writable: false, configurable: false},
        setSat: {value: setSat, writable: false, configurable: false},
        setLight: {value: setLight, writable: false, configurable: false},
        getValueOf: {value: getValueOf, writable: false, configurable: false},
        setDefault: {value: setDefault, writable: false, configurable: false}
    });

    return clrzr

}());

if (typeof module === 'object' && typeof process === 'object') {
    module.exports = colorizer;
} else if (typeof window === 'object' && typeof module === 'undefined') {
    window.colorizer = colorizer;
} else {
    throw new Error('Can not define environment')
}
