var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Scheme = mongoose.Schema;


var categoryScheme = new Scheme
({
    name:
    {
        type:String,
        required:[true, 'Debe asignar un nombre a la categoria'],
        unique: true
    },

    created_at:
    {
        type:Date,
        required:true,
        default: null,
    }
});

categoryScheme.plugin(uniqueValidator, {response: '{PATH} debe ser único'});

module.exports = mongoose.model('Category', categoryScheme);