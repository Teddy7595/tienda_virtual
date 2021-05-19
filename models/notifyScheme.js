var mongoose = require('mongoose');

var Scheme = mongoose.Schema;

var notifyScheme = new Scheme
({
    name:
    {
        type:String,
        required:[true, 'Se requiere un nombre para marcar la notificación'],
    },//nombre de la notificacion

    idPost:
    {
        type:String,
        required:false,
        default:null
    },//codigo id del post

    idUser:
    {
        type:String,
        required:false,
        default:null
    },//propietario del post realizado 

    idForeign:
    {
        type:String,
        required:false,
        default: null
    },//codigo id del usuario que interactuo con el post o con el user

    description:
    {
        type:String,
        required:[true, 'Se necesita una descripción para el asunto de la notificación']
    },

    created_at:
    {
        type:Date,
        required:true
    }

});

module.exports = mongoose.model('Notify', notifyScheme);