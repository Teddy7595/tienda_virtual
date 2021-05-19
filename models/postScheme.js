//ME JALO LAS LIBRERIAS NECESARIAS
var mongoose = require('mongoose');

//GENERO REGLAS DE ENUM
var tipo = 
{
    values: ['Servicios', 'Productos'],
    response: '{VALUE} no es un tipo de publicación permitido'
}

//GENERO EL SCHEME
var Scheme = mongoose.Schema;

var socialNet = new Scheme
({
	facebook:
	{
		type:String,
		required: false
	},
	twitter:
	{
		type:String,
		required: false
	},
	instagram:
	{
		type:String,
		required: false
	},
	mail:
	{
		type:String,
		required: false
	},
});

///ESQUEMA DE INVENTARIO DE PLANES APLICACDOS AL POST////////////
var planScheme = new Scheme
({
	plan:
	{
		type:Object,
		required: false
	},
	months:
	{
		type:Number,
		required: false
	},
	offer:
	{
		type:Number,
		required: false
	},
	total:
	{
		type:Number,
		required: false
	},
	status:
	{
		type:Boolean,
		required: false,
		default: false
	}
});
/////////////////////////////////////////////////////////////////

//CREO EL MODELO COMO TAL
var postScheme = new Scheme
({

	title:
	{
		type:String, 
		required:[true, 'Nombre de la publicación es necesario']
	},// titulo de la publicacion

	target:
	{
		type:Array,
		required:[true, 'Se requiere saber a quien va dirigido esta publicacion']
	},//a quien va dirigido la publicacion

	img:
	{
		type:Array, 
		required:[true, 'La publicación debe poseer una imagen que mostrar']
	},//el array de imagenes a mostrar
	
	text:
	{
		type:String, 
		required:[true, 'La publicación debe poseer alguna descripción']
	},//descripcion de la publicacion

	content:
	{
		type:String, 
		required:[true,'Debe incluir datos de lo contenido en el producto']
	},//tipo de producto o servicio que se ofrece

	notContent:
	{
		type:String, 
		required:[true,'Debe incluir datos de lo que no contiene el producto']
	},//tipo de producto o servicio que se ofrece

	type:
	{
		type:String, 
		required:[true, 'Debe definir el tipo de publicación'], 
		enum: tipo
	},//si es producto o servicio

	price:
	{
		type:Number, 
		required:[true, 'Debe establecer un precio a la publicación']
	},//precio de la publicacion

	phone:
	{
		type:String, 
		required:[true, 'Debe poseer al menos un numero de contacto']

	},//telefono de contacto

	view:
	{
		type:Number ,
		required:false,
		default: 0
	},//visitas a la publiacion

	points:
	{
		type:Number, 
		required:false
	}, //puntuacion de la publicacion

	days:
	{
		type:Number, 
		required:false
	},//dias en que estará activa la publicación

	status:
	{
		type:Boolean,
		required: false,
		default: false
	},//determinada por el admin si puede o no ser visible

	user:
	{
		type:Scheme.Types.ObjectId,
		ref:'User',
		required: [true, 'Debe existir un usuario válido para publicar']
	},//usuario dueño de la publicación

	category:
	{
		type:String, 
		required:[true,'Debe incluir una categoria del producto']
	},//tipo de producto o servicio que se ofrece

	verify_at:
	{
		type:String, 
		required:false,
		default: null
	},//fecha de cuando el admin revisó

	created_at:
	{
		type:String, 
		required:false
	},//fecha de cuando fue creado

	updated_at:
	{
		type:String, 
		required:false,
		default: null
	},//fecha de cuando fue modificado

	finished_at:
	{
		type:String, 
		required:false,
		default: null
	},//fecha de cuando fue finalizará

	comments: 
	{
		type: Array,
		required: false
	},//sistema de comentarios
	
	mapUrl:
	{
		type:String,
		required:[true, 'Debe proporcionar una ruta tipo MAPS del lugar']
	},//direccion del lugar en especifico mediante mapa

	dir:
	{
		type:String,
		required:[true, 'Direccion escrita del lugar']
	},//direccion escrita del domicilio donde se presta el servicio o pruducto

	department:
	{
		type:String,
		required: [true, 'Debe existir un departamento válido para publicar']
	},//departamento?
	city:
	{
		type:String,
		required: [true, 'Debe existir un municipio válido para publicar']
	},//ciudad?

	_socialNet: socialNet, //vergas de redes sociales

	file:
	{
		type:String,
		required:false,
		default: null
	},//donde se guardara archivo

	reactions:
	{
		type:Array,
		required:false
	},//si es like o dislike

	stars:
	{
		type:Array,
		required:false
	},//ranking mediante estrellas

	_plan:[planScheme] //esto almacenará el plan aplicado a la publicacion 

});

module.exports = mongoose.model('Post', postScheme);