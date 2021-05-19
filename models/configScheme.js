var mongoose = require('mongoose');

var Scheme = mongoose.Schema;

var CEO = new Scheme
({
    name:
    {
        type:String,
        required:[true, 'Debe asignar un nombre de CEO'],
    },

    photo:
    {
        type:String,
        required:[true, 'Debe asignar una foto del CEO'],
    },
});

var socialNet = new Scheme
({
    facebook:
    {
        type:String,
        required: false
    },

    instagram:
    {
        type:String,
        required: false
    },

    twitter:
    {
        type:String,
        required: false
    },

    linkedin:
    {
        type:String,
        required: false
    },
});

var slider = new Scheme
({
    web:
    {
        type:String,
        required: false,
        default: null
    },
    movil:
    {
        type:String,
        required: false,
        default: null
    },
    url:
    {
        type:String,
        required: false,
        default: null
    }
});

var configScheme = new Scheme
({
    logo_lg:
    {
        type:String,
        required:[true, 'Debe asignar un logo de pagina principal'],
        unique: true
    },

    logo_sm:
    {
        type:String,
        required:[true, 'Debe asignar un logo para responsive'],
        unique: true
    },

    month_price:
    {
        type:Number,
        required:[true, 'Debe establecer un precio base para el plan de publicación']
    },

    phone:
    {
        type:String,
        required: [true, 'Debe establecer un número de telefono de contacto']
    },

    email:
    {
        type:String,
        required: [true, 'Debe establecer un email de contacto']
    },

    dir:
    {
        type:String,
        required: [true, 'Debe establecer una direccion de oficina']

    },

    map:
    {
        type:String,
        required: [true, 'Debe establecer una direccion compatible para servicios como "google maps"']
    },

    _ceo: CEO,

    _socialNet: socialNet,

    _slider: [slider]

});

module.exports = mongoose.model('Configuration', configScheme);