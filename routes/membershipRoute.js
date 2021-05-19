var express = require('express');
var MemberShip = require('../models/mbpScheme');
var Post = require('../models/postScheme');
var mdAutentication = require('../middleware/autenticacion');
var moment = require('moment');

var dateMoment = moment().locale('es');
// se inicializa express
var app = express();

var json = 
{ 
	message: 'OK, Im member route',
	status: 200, 
	ok: true,
	data: 'OK, Im member route'
};


//RUTA QUE ME PERMITE OBTENER TODAS LAS MEMBRESIAS
app.get('/',(req,res,next)=>
{
	MemberShip.find({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Planes de membresias encontradas! ;-)';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'No hay planes de  membresias por el momento =/';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

//RUTA POST QUE ME PERMITE CREAR UN PLAN DE MEMBRESIA
app.post('/',
//[mdAutentication.verificaToken, mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	var body = req.body;

	//return res.status(200).json(body);

	var planScheme = 
	{
		price: body.price,
		img: body.img,
		doc: body.doc,
	};



	var member = new MemberShip
	({
		name: body.name, //nombre del plan
		title: body.title, //titulo del plan
		description: body.description,//caracteristicas del plan
		_refPlan: planScheme, //contenido numerico del plan
		_refOffer: body.offer, //esquema de oferta
		created_at: dateMoment.format('LL'),//cuando fue creado el plan
	});

	member.save((error,memberSaved)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = '¡Plan de membresía agregado! ;-)';
    	json.data = memberSaved;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });

});

//RUTA QUE ME PERMITE MODIFICAR UNA MEMBRESIA DEPENDIENDO DE SU ID
app.put('/:m',
//[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser], 
(req, res, next)=>
{

	var body = req.body;

	MemberShip.findById({_id:req.params.m}, (error,membership)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el plan de membresía =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!membership) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró el plan de membresía =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}

		var planScheme = 
		{
			price: body.price,
			img: body.img,
			doc: body.doc,
		};

		membership.name = body.name;
		membership.title = body.title;
		membership.description = body.description;
		membership._refPlan = planScheme;
		membership._refOffer = body.offer;
		membership.updated_at = dateMoment.format('LL');

		membership.save((err, memberSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar el plan de membresia!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Plan de membresia modificada!';
    		json.data = memberSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });

	});
});

//RUTA PARA ELIMINAR UN PLAN DE MEMBRESIA
app.delete('/:m',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	MemberShip.findByIdAndRemove({_id:req.params.m}, (error, member)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar el plan de membresía =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
		}
		
		if (!member) 
        {
            json.message = 'No se encontró el plan de membresía =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
		}
		
        json.message = '¡Plan de membresía eliminado! ;-)';
    	json.data = member;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });
});

 
/////////////////////////////////////COMMENT//////////////////////////////////
/*
***	RUTA ENCARGADA DE RENOVAR EL PLAN APLICADO A UNA PUBLICACIÓN EN ESPECIFICO
*/
/////////////////////////////////////COMMENT//////////////////////////////////
app.put('/renew/:p',[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser],async (req,res,next)=>
{
	///////////////////////////////////////////////////////////variables de seteo del plan del post//////////////////////////////
	var body = req.body; //cuerpo de la petición
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicación
	var aux = await MemberShip.findById(body.idPlan);//busco el plan en base al ID

	/*
	 * recuerda que necisto el body.nroOffer, body.idPlan, id de la publicacion
	 */
	var planApply = 
	{				
		plan: aux,
		months: aux._refOffer[body.nroOffer].months,
		offer: aux._refOffer[body.nroOffer].offer,
		total: aux._refPlan.price - ((aux._refOffer[body.nroOffer].offer/100) * aux._refPlan.price),
		status: true
	}

	var after = dateMoment.clone().add(planApply.months, 'months'); // le calculo cuando sera segun la cantidad de meses del plan
	var days = after.diff(dateMoment, 'days'); // saco la difrencia de dias entre las dos fechas

	//return res.status(200).json(aux);
	////////////////////////////////////////////////////////////modificacion del plan del post///////////////////////////////////
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

		post._plan[0].status = false;
		post._plan.unshift(planApply);
		post.days = days;

		var day = moment().add(post.days, 'days').calendar();
		post.finished_at = moment(day).locale('es').format('LL');

		//return res.status(200).json(post.finished_at);

        post.save((err, postSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al renovar el plan de publicación!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Plan de publicación renovado!';
    		json.data = postSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});
});

/////////////////////////////////////COMMENT//////////////////////////////////
/*
* RUTA QUE MUESTRA UNA PREVIEW DEL CAMBIO DE PLANES JUNTO CON LA DIFERENCIA A PAGAR
*/
/////////////////////////////////////COMMENT//////////////////////////////////

app.post('/preview/:p/:m',[mdAutentication.verificaToken], async(req,res,next)=>
{
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicación
	var m = req.params.m //recibe el id del nuevo plan 
	var aux = await MemberShip.findById(m);//busco el plan en base al ID
	var post = await Post.findById({_id:p, user:u}); //busco el post en base al ID
	var price = post._plan[0].total // se obtiene el precio del plan aplicado al post

	/////////////////////////REGLA DE 3 APLICDO AL PLAN//////////////////////////////
	var daysPlan = dateMoment.clone().add(post._plan[0].months,'months');
	var daysPlan = daysPlan.diff(dateMoment, 'days');
	var total = (price * post.days)/daysPlan;
	/////////////////////////////////////////////////////////////////////////////////

	json.message = 'Usted estaría abonando al nvo plan :';
	json.data =
	{
		'daysUsed': post.days, // dias usados en el post
		'daysPlan': daysPlan, //dias del plan aplicado al post
		'pricePlan': post._plan[0].total, //total del plan aplciado al post
		'saldoPos': total, // saldo positivo para abonar
		'planNew': aux //nuevo plan que se quiere instanciar
	}

	return res.status(200).json(json);

});

module.exports = app;