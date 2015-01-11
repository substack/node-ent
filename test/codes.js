var test = require('tape');
var punycode = require('punycode');
var ent = require('../');

test('amp', function (t) {
    var a = 'a & b & c';
    var b = 'a &#38; b &#38; c';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('html', function (t) {
    var a = '<html> © π " \'';
    var b = '&#60;html&#62; &#169; &#960; &#34; &#39;';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('html named', function (t) {
    var a = '<html> © π " \'';
    var b = '&lt;html&gt; &copy; &pi; &quot; &apos;';
    t.equal(ent.encode(a, { named: true }), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('entities', function (t) {
    var a = '\u2124';
    var b = '&#8484;';
    t.equal(ent.encode(a), b);
    t.equal(ent.decode(b), a);
    t.end();
});

test('entities named', function (t) {
    var a = '\u2124';
    var b = '&Zopf;';
    t.equal(ent.encode(a, { named: true }), b);
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

test('astral num', function (t) {
    var a = punycode.ucs2.encode([0x1d306]);
    var b = '&#x1d306;';
    t.equal(ent.decode(b), a);
    t.equal(ent.decode(b + b), a + a);
    t.end();
});

test('nested escapes', function (t) {
    var a = '&amp;';
    var b = '&#x26;amp;';
    t.equal(ent.decode(b), a);
    t.equal(ent.decode(b + b), a + a);
    t.end();
});
