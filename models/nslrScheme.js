var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Scheme = mongoose.Schema;


var newsLetterScheme = new Scheme
({
    email:
    {
        type:String,
        required:[true, 'Debe asignar un correo para recibir información'],
        unique: true
    }
});

newsLetterScheme.plugin(uniqueValidator, {response: '{PATH} debe ser único'});

module.exports = mongoose.model('NewsLetter', newsLetterScheme);