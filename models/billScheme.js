var mongoose = require('mongoose');

var Scheme = mongoose.Schema;



var billScheme = new Scheme
({
    post:
    {
        type:Scheme,
        required:true,
        default:null
    },//post realizado 

    userId:
    {
        type:String,
        required:true,
        default:null
    },//codigo del usuario 

    user:
    {
        type:Scheme,
        required:true,
        default:null
    },//usuario comprador 

    description:
    {
        type:String,
        required:[true, 'Se necesita una descripción para la factura']
    },//alguna observación de la factura

    mount:
    {
        type:String,
        required:[true, 'Se necesita una descripción para la factura']
    },//monto de pago

    created_at:
    {
        type:Date,
        required:true,
        default: null
    }//fecha de creación

});

module.exports = mongoose.model('Bill', billScheme);