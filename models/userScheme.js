var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var moment = require('moment');
var today = moment().locale('es');

var roles = 
{
    values: ['ADMIN_ROLE', 'CLIENTE_ROLE', 'EMPRESA_ROLE'],
    response: '{VALUE} no es un role permitido'
}
var Scheme = mongoose.Schema;

var userScheme = new Scheme
({
    name: 
    {
    	type:String, 
    	required:[true, 'Nombre es necesario'] 
    },

    year: 
    {
        type:Number, 
        unique: true, 
        required:[true, 'Edad es necesario'] 
    },

    gender: 
    {
        type:String, 
        unique: true, 
        required:[true, 'Género es necesario'] 
    },

    preference: 
    {
        type:Array, 
        unique: false, 
        required:[true, 'Preferencias es necesario'] 
    },
    
    email: 
    {
    	type:String, 
    	unique: true, 
    	required:[true, 'Email es necesario'] 
    },
    
    pass: 
    {
    	type:String, 
    	required:[true, 'La contraseña es necesaria'] 
    },
    
    img: 
    {
    	type:String, 
    	required:false},
    role: 
    {
    	type:String, 
    	required:true, 
    	default: 'CLIENTE_ROLE', 
        enum: roles 
    },
    
    status: 
    {
    	type:String, 
    	required:true, 
    	default: true
    },
    
    type: 
    {
    	type:String, 
    	required:true
    },
    
    created_at: 
    {
        type:String, 
        required:false,
        default: today.format('dddd Do MMMM YYYY hh:mm:ss a')
    },
    
    updated_at: 
    {
        type:Date, 
        required:false,
        default: null
    },

    firstTime:
    {
        type:Boolean,
        required:false,
        default: true
    }

});

userScheme.plugin(uniqueValidator, {response: '{PATH} debe ser único'});

module.exports = mongoose.model('User', userScheme);