module.exports = (function() {
    'use strict';
    const hidden = 'hiden value';

    return {
        log(msg) {
            console.log(msg);
            console.log(hidden);
        }
    }
}());