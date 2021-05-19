var express = require('express');

// se inicializa express
var app = express();

//importamos los modelos que necesitamos por el momento
var Post = require('../models/postScheme');
var User = require('../models/userScheme');

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im browser route',
	status: 200, 
	ok: true,
	data: 'OK, Im browser route'
};

// rutas
// el get recibe 3 parametros, request. eñ response y el next
// el next cuando se ejecuta hara que se continue con otra funcion
app.post('/:id?', (req, res, next) => 
{
	var busqueda = req.body.title; // dato a buscar
	var regex = new RegExp( busqueda, 'i' ); // expresion literaria

	var jsonFinder = {}; //esquema maestro del json de busqueda
	var auxDir = {}; //variable auxiliar que contendra los datos de localizacion

	/////// OPERADORES TERNARIOS PARA LLENAR EL JSON DE BUSQUEDA///////
	req.body.type? jsonFinder.type = req.body.type : null; //tipo servicio o producto
	req.body.categoryp? jsonFinder.categoryp = req.body.categoryp : null; //categoria padre del servicio o producto
	req.body.categoryc? jsonFinder.categoryc = req.body.categoryc : null; //categoria hija del servicio o producto
	req.body.min? jsonFinder.min = req.body.min : null; //rango menor d eprecio
	req.body.max? jsonFinder.max = req.body.max : null; //rango mayor de precio
	req.body.target? jsonFinder.target = req.body.target : null; //a quien va dirigido
	req.body.cityTarget? jsonFinder.cityTarget = req.body.cityTarget : null; //a quien va dirigido
	req.body.points? jsonFinder.points = req.body.points : null; //a quien va dirigido

	req.body.city? auxDir.city = req.body.city : null; //ciudad
	req.body.dpt? auxDir.department = req.body.dpt : null; // no se que otr verga
	auxDir? jsonFinder._dir = auxDir : null; //direccion encapsulada
	/////// OPERADORES TERNARIOS PARA LLENAR EL JSON DE BUSQUEDA///////

	if(req.params.id){ preferences(req.params.id, jsonFinder);}

	//return res.status(200).json(jsonFinder);

	Promise.all
	([
		//regexFind(regex),
		flexibleFinder2(regex), //basados en una expresion regular
		flexibleFinder(regex, jsonFinder), //basados en condicionales OR
		specificFinder(regex, jsonFinder), //basados en condicionales and
		//firstFind(jsonFinder._dir.municipality),
	]).then(result=>
	{
		json.data = result.filter(function(item){ return item.length >0 ;});
		json.message = 'Resultados encontrados';
		json.status = 200;
		json.ok = true;

		return res.status(200).json(json);
	});
	
});

function regexFind(regex)
{
	return new Promise((resolve, reject)=>
	{
		Post.find({'title': regex},(err,posts)=>
		{
			if(err){reject(err);}
			if(posts){resolve(posts);}
		});
	});
}

function firstFind(zone)
{
	return new Promise((resolve, reject)=>
	{
		Post.find
		({

			'_dir.municipality':zone

		}).exec((err,posts)=>
		{
			if(err){reject(err);}
			if(posts){resolve(posts);}
		});
	});
}

function flexibleFinder2(regex) 
{
	return new Promise((resolve, reject)=>
	{
		Post.find
		({
			$or:
			[
				{'title':regex}, //expresion regular para el titulo
				{'type':regex},//el tipo de publicacion si es producto o servicio
				{'_category.principal': regex }, //recibe un array de datos
				{'_category.child': regex }, //recibe un array de datos
				{'_rangoPrize.min': regex }, //rango de valor monetario
   				{'_rangoPrize.max': regex }, //rango de valor monetario
				{'city':regex }, //ubicación de donde fue hecha la publiación
				{'deparment': regex }, //ubicación de donde fue hecha la publiación
				{'_target': regex }, //recibe un array de datos 
				{'_cityTarget.department': regex }, //recibe un array de datos
				{'_cityTarget.city': regex }, //recibe un array de datos
				{'_target.tag': regex } //recibe un array de datos
			]
		}).exec((err,posts)=>
		{ 	
			if(err){reject(err);} 
			if(posts){ resolve(posts); }else{ reject('No se encontro resultados'); } 
		});
	});
}

function flexibleFinder(regex, body) 
{
	return new Promise((resolve, reject)=>
	{
		Post.find
		({
			$or:
			[
				{'title':regex}, //expresion regular para el titulo
				{'type':body.type},//el tipo de publicacion si es producto o servicio
				{'_category.principal':{ $in:[body.categoryp] }}, //recibe un array de datos
				{'_category.child':{ $in:[body.categoryc] }}, //recibe un array de datos

				{'_rangoPrize.min':{$gte:body.min}}, //rango de valor monetario
				{'_rangoPrize.max':{$lte:body.max}}, //rango de valor monetario
				   
				{'city':body.city}, //ubicación de donde fue hecha la publiación
				{'deparment':body.department}, //ubicación de donde fue hecha la publiación
				{'_target':{$all:[body.target]}}, //recibe un array de datos 
				{'_cityTarget.department': { $in:[body.cityTarget] }}, //recibe un array de datos
				{'_cityTarget.city': { $in:[body.cityTarget] }}, //recibe un array de datos
				{'_target.tag': { $in:[body.taget] }}, //recibe un array de datos

				{'points': { $lte:body.points }}, //recibe un puntaje maximo donde buscar

			]
		}).exec((err,posts)=>
		{ 	
			if(err){reject(err);} 
			if(posts){ resolve(posts); }else{ reject('No se encontro resultados'); } 
		});
	});
}

function specificFinder(regex, body) 
{
	
	return new Promise((resolve, reject)=>
	{
		Post.find
		({ 
			$and:
			[
				{'title':regex}, //expresion regular para el titulo
				{'type':body.type},//el tipo de publicacion si es producto o servicio
				{'_category.principal':{$in:[body.categoryp] }}, //recibe un array de datos 
				{'_category.child':{$in:[body.categoryc] }}, //recibe un array de datos 

				{'_rangoPrize.min':{$gte:body.min}}, //rango de valor monetario
				{'_rangoPrize.max':{$lte:body.max}}, //rango de valor monetario
				   
				{'city':body.city}, //ubicación de donde fue hecha la publiación
				{'deparment':body.department}, //ubicación de donde fue hecha la publiación
				{'_target':{$all:[body.target]}}, //recibe un array de datos
				{'_cityTarget.department': { $in:[body.cityTarget] }}, //recibe un array de datos
				{'_cityTarget.city': { $in:[body.cityTarget] }}, //recibe un array de datos
				{'_target.tag': { $in:[body.taget] }}, //recibe un array de datos
				{'points': { $lte:body.points }}, //recibe un puntaje maximo donde buscar
			]
		}).exec((err,posts)=>
		{ 	
			if(err){reject(err);} 
			if(posts){ resolve(posts); }else{ reject('No se encontro resultados'); } 
		});
	});	
}

function preferences(id, json)
{
	User.findById(id, (error,user)=>
	{
		if (error){ console.log('No se pudo buscar al usuario,error 500'); return;}

		if (!user){ console.log('No existe este usuario, error 400'); return;}

		user.preferences.push(json);

        user.save((err, userSaved)=>
        {
			if(err){ console.log('No se pudo guardar estadisticas de preferencias 500');}
        });
	});
}

app.post('/orderBy/:p/:t', async (req, res, next) => 
{

	/**
	 * RECIBE POR URL P SI ES POR PRECIO O POR PUNTAJE Y EL TIPO SI ES DE MAYOR A MENOR O VICEVERSA
	 */
	var p = req.params.p // si es precio o puntaje
	var t = req.params.t //  si es menor que o mayor que
	var posts = await Post.find(); // se trae hasta a chavez en esta verga...

	if (p === 'price') 
	{
		if(t === 'mayor'){	posts.sort((a,b)=>{return b._rangoPrize.max - a._rangoPrize.max }); } //mayor que

		if(t === 'menor'){	posts.sort((a,b)=>{return a._rangoPrize.min - b._rangoPrize.min }); } //menor que

		json.data = posts;
		json.message = 'Resultados organizados por precio';
		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	}

	if (p === 'points') 
	{
		if(t === 'mayor'){	posts.sort((a,b)=>{return b.points - a.points }); } //mayor que

		if(t === 'menor'){	posts.sort((a,b)=>{return a.points - b.points }); } //menor que

		json.data = posts;
		json.message = 'Resultados organizados por puntaje';
		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	}

});

module.exports = app;