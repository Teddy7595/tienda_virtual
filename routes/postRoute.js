var express = require('express');
var Post = require('../models/postScheme');
var moment = require('moment');

var mdAutentication = require('../middleware/autenticacion');

var dateMoment = moment().locale('es');
//inicializamos express
var app = express();

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: 'OK, Im post route'
};

//RUTA GET DE TODOS LOS POST
app.get('/' ,(req,res,next)=>
{
	Post.find({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = response.length +' ¡Publicaciones encontrados!';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Publicaciones no encontrados';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

//RUTA GET DE TODOS LOS POST hechos por un usario logeado
app.get('/publicaciones',[mdAutentication.verificaToken ,mdAutentication.verificaAdminRoleoMismoUser],(req,res,next)=>
{
	Post.find({user: req.usuario._id}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Publicaciones totales encontrados! ' + response.lenght;
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Publicaciones no encontrados';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

/*
	Ruta de creacion de publicaciones recibirá el id del usuario y el middelware tiene que certificar
	que este mismo usuario este logeado
*/

app.post('/',mdAutentication.verificaToken, /*TUVE QUE CONVERTIR ESTA MRD EN ASINCRONO*/async (req,res,next)=>
{
	var body = req.body;
	var idUser = req.usuario._id;

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////////procedimiento para obtener y clonar el plan////////////////////////////////
	//Pd maldita promesas ladilla esa verga hay que colocarle un async para q espere el retorno del mrdero q se busca
	var Plan = require('../models/mbpScheme'); //tengo que importar la vaina de las membresia, el modelo
	var aux = await Plan.findById(body.idPlan); // aqui lo busco directo sin tanta guebadas aunque 
												//tengo que convertir en async la funcion padre

	/*
		PD: NECESITO UN INDICE QUE DETERMINE QUE OFERTA ESCOGIO EL SOPLA VERGA QUE VA A PUBLICAR, ES DECIR UN INDICE QUE
		ME AYUDE A DETERMINAR QUE NODO DEL ARRAY DE OFERTA VOY A APLICAR EN EL PLAN, POR ESO USO UNA VARIABLE DEL BODY
		LLAMADA "body.nroOffer" PARA SABER CUAL OFERTA APLICAR... .I. 
	*/
	var planApply = //cuando xfin tengo el mrdero lo aplico en un json artificial para luego samparselo a la publicacion
	{				//aqui haré de una vez tambien las mrd de los dias y las fechas... 
		plan: aux,
		months: aux._refOffer[body.nroOffer].months,
		offer: aux._refOffer[body.nroOffer].offer,
		total: aux._refPlan.price - ((aux._refOffer[body.nroOffer].offer/100) * aux._refPlan.price),//esta calcula el total con todo y descuento
		status: true//el status del plan activo

	}//YA TENIENDO EL CLON DEL PLAN ESTABLECIDO, PODEMOS PUTEARLO Y SAMPARLO DENTRO DEL POST SIN PEDOS...

	/////ahora tengo que fajarme a calcular el guebo de las ffechas para tener los dias que durara el pinche post...
	var after = dateMoment.clone().add(planApply.months, 'months'); // le calculo cuando sera segun la cantidad de meses del plan
	var days = after.diff(dateMoment, 'days'); // saco la difrencia de dias entre las dos fechas 

	var day = moment().add(days, 'days').calendar();//saco la fecha de finalizacion mas exacta
	var finished_day = moment(day).locale('es').format('LL'); //determino la fecha de finalizacion mas exacta
	//return res.status(200).json(days);
	/////////////////////////////////////////////fin del procedimiento///////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var socialNet =
	{
		facebook: body.facebook, //facebook
		twitter: body.twitter, //twitter
		instagram: body.instagram, //instagrm
		mail: body.mail // correo
	};

	var post = new Post
	({
		title: body.title,//titulo
		text: body.txt, //descripcion gral del producto
		content: body.content, // Descripcion del contenido incluido el producto o servicio
		notContent: body.notContent, // Descripcion del contenido no incluido en el producto o servicio
		img: body.img, //imagenes
		dir: body.dir, //direccion domicilio del servicio o producto
		target: body.target, //quien va dirigido la publicacion
		type: body.type, //servicio o producto?
		mapUrl: body.mapUrl, //direccion de domiciñop
		price: body.price, //precio
		phone: body.tlf, //telefeno
		user: idUser, //usuario dueño del post
		category: body.catg, //categoria del producto o servicio
		created_at: dateMoment.format('LL'), //fecha de creacion
		department: body.dpmt, // departamento
		city: body.city, //ciudad
		file: body.file, // archivos pdf
		_socialNet: socialNet, // redes sociales
		status: true, //si es visible o no que luego verificación certificara si dejarla visible o sacarla de la palestra

/////////////////////////////////////////////////////////CLON DEL PLAN DE MEMBRESIA//////////////////////////////////////////////////////
		days: days, //cantidad de dias ofrecido por el plan de membresia
		_plan: planApply, //clon del plan con todos los datos
		finished_at: finished_day // la fecha en que finalizara la publicacion
		/////////SI HAS LLEGADO HASTA AQUI TODAVIA Y MANTIENES LA CORDURA, FELICIDADES SOPLA VELAS, TE HAS GANADO UN BESO EN UNA NALGA
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	});

	//return res.status(200).json(post);
	post.save((error,postSaved)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = '¡Publicación agregada, pronto estará disponible al público!';
    	json.data = postSaved;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });

});

/*
	Ruta de modificacion de publicaciones, recibirá el id del usuario e id de la publicacion
*/

app.put('/:p',[mdAutentication.verificaToken ,mdAutentication.verificaAdminRoleoMismoUser],(req,res,next)=>
{
	var body = req.body;
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicacion

	Post.findById({_id:p, user:u}, (error,post)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar la publicación';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!post) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró la publicación';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}

		post._socialNet.web = body.web;
		post._socialNet.facebook = body.facebook;
		post._socialNet.twitter = body.twitter;
		post._socialNet.instagram = body.instagram;
		post.dir = body.dir;
		post.phone = body.phone;
		post._rangoPrize = body._rangoPrize;
		post.department = body.department;
		post.city = post.city;
		post.mapUrl = body.mapUrl;
		post.target = body.target;
		post._cityTarget = body.cityTarget;

		post.updated_at = dateMoment.format('LL');

        post.save((err, postSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar la publicación!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Publicacion modificada!';
    		json.data = postSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});
});

/* 
	Ruta encargada de borrar publicaciones basada en id de usuario y la publicacion
*/

app.delete('/:p',[mdAutentication.verificaToken ,mdAutentication.verificaAdminRoleoMismoUser],(req,res,next)=>
{
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicacion

	Post.findByIdAndRemove({_id:p, user:u}, (error, postDeleted)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar la publicación';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
		}
		
		if (!postDeleted) 
        {
            json.message = 'No se encontró la publicación';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
		}
		
        json.message = '¡Publicación eliminada!';
    	json.data = postDeleted;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });
});

module.exports = app;