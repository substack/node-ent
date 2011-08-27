const entities = JSON.parse(
    require('fs').readFileSync(__dirname + '/entities.json', 'utf8')
);

var revEntities = {};
for(var i in entities)
    revEntities[ String.fromCharCode(entities[i]) ] = i;

//based upon http://code.google.com/p/jslibs/wiki/JavascriptTips#Escape_and_unescape_HTML_entities

exports.encode = function (str) {
    // an empty string is also an option
    return str.replace(/[^\x20-\x7E]/g, function(str){
        return revEntities[str] ? "&" + revEntities[str] + ";" : str;
    })
};

exports.decode = function (str) {
    return str.replace(/&(.+?);/g, function(str, ent){
        return String.fromCharCode( ent[0] !== '#' ? entities[ent] : ent[1] === "x" ? parseInt(ent.substr(2),16) : parseInt(ent.substr(1)) ) 
    });
};
