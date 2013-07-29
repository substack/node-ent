var fs = require('fs');
var data = require('./data.json');

var entities = {};
var reversed = {};

data.forEach(function (entity) {
    entity.reference = entity.reference.substring(1); //remove the '&'
    entities[entity.reference] = entity.glyph;
    if (entity.glyph.length === 1 && /\;$/.test(entity.reference)) {
        reversed[entity.glyph.charCodeAt(0)] = entity.reference;
    }
});

function escape(str){
    var i = str.length;
    var aRet = [];

    while (i--) {
        var iC = str.charCodeAt(i);
        if (iC > 127) {
            var code = iC.toString(16).toUpperCase();
            while (code.length < 4) code = '0' + code;
            aRet[i] = '\\u' + code;
        } else {
            aRet[i] = str[i];
        }
    }
    return aRet.join('');
}

fs.writeFileSync(__dirname + '/../entities.json', escape(JSON.stringify(entities, null, 4)));
fs.writeFileSync(__dirname + '/../reversed.json', escape(JSON.stringify(reversed, null, 4)));