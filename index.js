var entities = require('./entities.json');

var revEntities = {};
for (var key in entities) {
    var e = entities[key];
    var s = typeof e === 'number' ? String.fromCharCode(e) : e;
    revEntities[s] = key;
}

exports.encode = function (str, options) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a String');
    }

    var opts = options || {},
        decimalOnly = opts.decimalOnly || false;

    return str.split('').map(function (c) {
        var e = !decimalOnly ? revEntities[c] : undefined;
        var cc = c.charCodeAt(0);
        if (e) {
            return '&' + e + ';';
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
            return String.fromCharCode(code);
        })
        .replace(/&#[xX]([A-Fa-f0-9]+);?/g, function (_, hex) {
            return String.fromCharCode(parseInt(hex, 16));
        })
        .replace(/&([^;\W]+);?/g, function (m, e) {
            var target = entities[e];

            if (typeof target === 'number') {
                return String.fromCharCode(target);
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
