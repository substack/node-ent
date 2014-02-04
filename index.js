var punycode = require('punycode');
var entities = require('./entities.json');
var revEntities = require('./reversed.json');

// Always escape these characters when encoding
var alwaysEscape = {
    '34': 'quot',
    '38': 'amp',
    '39': 'apos',
    '60': 'lt',
    '62': 'gt'
};

var getNamedEntity = function (code, useNamedReferences) {
    var e = alwaysEscape[code];

    // Only use named references for non-ASCII characters
    if (!e && useNamedReferences && /[^\x20-\x7F]/.test(punycode.ucs2.encode([code]))) {
        e = revEntities[code];
    }

    return e;
};

exports.encode = function (str, options) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a String');
    }

    var opts = options || {},
        useNamedReferences = (opts.useNamedReferences !== undefined) ? opts.useNamedReferences : true;

    return str.split('').map(function (c) {
        var cc = c.charCodeAt(0);
        var e = getNamedEntity(cc, useNamedReferences);
        if (e) {
            return '&' + (e.match(/;$/) ? e : e + ';');
        }
        else if (cc < 32 || cc >= 127) {
            return '&#' + cc + ';';
        }
        else if (c.match(/\s/)) {
            return c;
        }
        else {
            return c;
        }
    }).join('');
};

exports.decode = function (str) {
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
};
