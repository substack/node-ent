var test = require('tape');
var ent = require('../');
var entities = require('../entities.json');

test('amp', function (t) {
    var a = 'a & b & c';
    var b = 'a &amp; b &amp; c';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('html', function (t) {
    var a = '<html> © π " \' ∴ Β β';
    var b = '&lt;html&gt; &copy; &pi; &quot; &apos; &there4; &Beta; &beta;';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('num', function (t) {
    var a = String.fromCharCode(1337);
    var b = '&#1337;';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);

    t.equal(ent.encode(a + a), b + b);
    t.equal(ent.decode(b + b), a + a);
    t.end();
});

test('hex', function (t) {
    for (var i = 0; i < 32; i++) {
        var a = String.fromCharCode(i);
        if (a.match(/\s/)) {
            t.equal(ent.decode(a), a);
        }
        else {
            var b = '&#x' + i.toString(16) + ';';
            t.equal(ent.decode(b), a);
            t.equal(ent.encode(a), '&#' + i + ';');
        }
    }

    for (var i = 127; i < 2000; i++) {
        var a = String.fromCharCode(i);
        var b = '&#x' + i.toString(16) + ';';
        var c = '&#X' + i.toString(16) + ';';

        t.equal(ent.decode(b), a);
        t.equal(ent.decode(c), a);

        var encoded = ent.encode(a);
        var encoded2 = ent.encode(a + a);
        if (!encoded.match(/^&\w+;/)) {
            t.equal(encoded, '&#' + i + ';');
            t.equal(encoded2, '&#' + i + ';&#' + i + ';');
        }
    }
    t.end();
});


test('decimal encoding', function (t) {
    for (var key in entities) {
        var e = entities[key],
            a = '&' + key + ';';

        // Decode into the Unicode character
        var decoded = ent.decode(a);
        t.equal(decoded, (typeof e == 'number') ? String.fromCharCode(e) : e);

        // Encode it as a decimal entity
        var encodedDec = ent.encode(decoded, { decimalOnly: true });

        // Make sure the decimal entity is properly encoded
        if (typeof e == 'number') {
            t.equal(encodedDec, '&#' + e + ';');
        }
        else {
            t.equal(encodedDec, a);
        }

        t.equal(decoded, ent.decode(encodedDec));
    }

    t.end();
});

test('double encoding', function(t) {
    var a = '&3509;&3510;';

    t.equal(ent.encode(a), '&amp;3509;&amp;3510;');
    t.equal(ent.encode(a, { decimalOnly: true }), '&amp;3509;&amp;3510;');

    t.end();
});