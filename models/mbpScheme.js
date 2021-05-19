var mongoose = require('mongoose');

var Scheme = mongoose.Schema;
//modelo esquema de membresias y planes



var planScheme = new Scheme
({
    price:
    {
        type:Number,
        required: [true, 'Se necesita establecer un precio al plan'],
        default: 0
    },//precio del plan

    img:
    {
        type:Number,
        required: [true, 'Debe establecer una cantidad de fotos limites']
    },//cantidad de imagenes diponibles por plan

    doc:
    {
        type:Number,
        required: [true, 'Debe establecer la cantidad de documentos permitidos']
    }//cantidad de documentos permitidos
});

var offerScheme = new Scheme
({
    months:
    {
        type:Number,
        required: false,
    },//cantidad de meses para el descuendo

    offer:
    {
        type:Number,
        required: false,
    },//porcentaje del descuento
});

memberScheme = new Scheme
({
    name:
    {
        type:String,
        required:[true, 'Debe asignar un nombre al plan de membresía'],
        unique:true
    },//nombre de la membresia

    title:
    {
        type:String,
        required:[true, 'Debe asignar un titulo al plan de membresía'],
        unique:true
    },//titulo al plan 

    description:
    {
        type:Array,
        required:[true, 'Debe asignar una descripción al plan de membresía']
    },//de que trata esta membresia su alcance

    _refPlan: planScheme,//donde irá el modelo artificial que incluira el contenido del plan

    _refOffer:[offerScheme],//donde irá el modelo artificial que incluira el contenido de la oferta por mes

    created_at:
    {
        type:String,
        required: true,
        default: null
    },//cuando fue creado

    updated_at:
    {
        type:String,
        required: false,
        default: null
    }// cuando fue actualizado

});

module.exports = mongoose.model('Membership', memberScheme);