/**
 * Created by Daniele Brugnara on 4/20/14.
 */

var test = require('tape')
    , ent = require('../')
;

test('decoding a simple object should keep numbers', function(t) {
    var obj = {
        num: 1,
        num2: 2
    }
    t.equal(ent.decodeRecursively(obj).num, 1);
    t.equal(ent.decodeRecursively(obj).num2, 2);
    t.end();
})

test('decoding a simple object should keep null fields', function(t) {
    var obj = {
        f1: null,
        f2: null
    }
    //
    t.equal(ent.decodeRecursively(obj).f1, null);
    t.equal(ent.decodeRecursively(obj).f2, null);
    t.end();
})

test('decoding a simple object keep boolean fields', function(t) {
    var obj = {
        f1: false,
        f2: true
    }
    //
    t.equal(ent.decodeRecursively(obj).f1, false);
    t.equal(ent.decodeRecursively(obj).f2, true);
    t.end();
})

test('decoding a object with strings', function(t) {
    var obj = {
        f1: false,
        f2: null,
        f3: 'string',
        f4: 'string&agrave;'
    }
    //
    t.equal(ent.decodeRecursively(obj).f3, 'string');
    t.equal(ent.decodeRecursively(obj).f4, 'stringà');
    t.end();
})

test('should decode recursively a object', function(t) {
    var obj = {
        f1: '&agrave;',
        f2: {
            f1: '&egrave;',
            f2: {
               f1: '&ugrave;'
            }
        },
        f3: [
            '&igrave;',
            1
        ]},
        objExpected = {
            f1: 'à',
            f2: {
                f1: 'è',
                f2: {
                    f1: 'ù'
                }
            },
            f3: [
                'ì',
                1
            ]
        }
    //
    var result = ent.decodeRecursively(obj);
    t.deepEqual(result, objExpected);
    t.end();
})




