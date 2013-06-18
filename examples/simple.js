var ent = require('ent');
console.log(ent.encode('<span>©moo</span>'));
console.log(ent.encode('<span>©moö</span>', { decimalOnly: true }));
console.log(ent.decode('&pi; &amp; &rho;'));
