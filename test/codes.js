var test = require('tape');
var punycode = require('punycode');
var ent = require('../');
var revEntities = require('../reversed.json');

test('amp', function (t) {
    var a = 'a & b & c';
    var b = 'a &amp; b &amp; c';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('html', function (t) {
    var a = '<html> © π " \'';
    var b = '&lt;html&gt; &copy; &pi; &quot; &apos;';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('entities', function (t) {
    var a = '\u2124';
    var b = '&Zopf;';
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

test('astral num', function (t) {
    var a = punycode.ucs2.encode([0x1d306]);
    var b = '&#x1d306;';
    t.equal(ent.decode(b), a);
    t.equal(ent.decode(b + b), a + a);
    t.end();
});

test('decimal encoding', function (t) {
    var a = 'a © l π h å ß ĕ t â';
    var b = 'a &#169; l &#960; h &#229; &#223; &#277; t &#226;';
    t.equal(ent.encode(a, { useNamedReferences: false }), b);
    t.equal(ent.decode(b), a);

    for (var key in revEntities) {
        var e = revEntities[key],
            a = '&' + e,
            b = '&#' + key + ';';

        // Don't test standard ASCII characters (they aren't encoded)
        if (key >= 32 && key < 127) continue;

        // Decode into the Unicode character
        var decoded = ent.decode(a);

        // Encode it as a decimal entity
        var encodedDec = ent.encode(decoded, { useNamedReferences: false });

        // Make sure the decimal entity is properly encoded
        t.equal(encodedDec, b);

        // And decode once more, for good measure
        t.equal(decoded, ent.decode(encodedDec));
    }

    t.end();
});

test('double encoding', function(t) {
    var a = '&3509;&3510;',
        b = '&amp;3509;&amp;3510;';

    t.equal(ent.encode(a), b);
    t.equal(ent.encode(a, { useNamedReferences: false }), b);

    t.end();
});
