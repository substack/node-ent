var punycode = require('punycode');
var entities = require('./entities.json');

module.exports = decode;

function decode (str) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a String');
    }

    return str
        .replace(/&#(\d+);?/g, function (_, code) {
            return punycode.ucs2.encode([code]);
        })
        .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
            return punycode.ucs2.encode([parseInt(hex, 16)]);
        })
        .replace(/&([^;\W]+;?)/g, function (m, e) {
            var ee = e.replace(/;$/, '');
            var target = entities[e]
                || (e.match(/;$/) && entities[ee])
            ;

            if (typeof target === 'number') {
                return punycode.ucs2.encode([target]);
            }
            else if (typeof target === 'string') {
                return target;
            }
            else {
                return m;
            }
        })
    ;
}
