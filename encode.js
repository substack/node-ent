var revEntities = require('./reversed.json');

module.exports = encode;

function encode (str, opts) {
    if (typeof str !== 'string') {
        throw new TypeError('Expected a String');
    }
    var special = {
        '"': true, "'": true,
        '<': true, '>': true,
        '&': true
    };
    if (!opts) opts = {};

    var numeric = true;
    if (opts.named) numeric = false;
    if (opts.numeric !== undefined) numeric = opts.numeric;

    return str.split('').map(function (c) {
        var cc = c.charCodeAt(0);
        var e = revEntities[cc];
        if (e && (cc >= 127 || special[c]) && !numeric) {
            return '&' + (e.match(/;$/) ? e : e + ';');
        }
        else if (cc < 32 || cc >= 127 || special[c]) {
            return '&#' + cc + ';';
        }
        else if (/\s/.test(c)) {
            return c;
        }
        else {
            return c;
        }
    }).join('');
}
