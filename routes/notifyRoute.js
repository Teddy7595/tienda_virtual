var express = require('express');
var Notify = require('../models/notifyScheme');

var mdAutentication = require('../middleware/autenticacion');

// se inicializa express
var app = express();
var json = 
{ 
	message: 'OK, Im user route',
	status: 200, 
	ok: true,
	data: 'OK, Im user route'
};

//retorna todas las notificaciones
app.get('/', 
mdAutentication.verificaToken,
(req, res, next) => 
{
    Notify.find({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Notificaciones encontradas! '+ response.length;
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Notificaciones no encontradas';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});
});

//retorna todas las notificaciones en base al id del user
app.get('/', 
[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser],
(req, res, next) => 
{
    Notify.find({user: req.usuario._id}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Notificaciones encontradas! ' + response.length;
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Notificaciones no encontradas';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});
});

//añade una notificación a la palestra con los datos de que genero la notificación,
//la publicacion y el dueño de la publicacion
app.post('/',  
mdAutentication.verificaToken,
(req, res, next) => 
{
    var body = req.body;
    
	var notify = new Notify
	({
        name: body.name,
        description: body.descp,
        idUser: body.idPoster,
        idPost: body.idPost,
        idForeign: req.usuario._id
	});

	notify.save((error,notifySaved)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = '¡Notificado!';
    	json.data = notifySaved;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });
});


//borra una notificación en base al id de la misma
app.delete('/:n',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser], 
(req, res, next) => 
{
    Notify.findByIdAndRemove({_id:req.params.n}, (error, notifyDeleted)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar la notificación';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
		}
		
		if (!notifyDeleted) 
        {
            json.message = 'No se encontró la notificación';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
		}
		
        json.message = '¡Notificación eliminada!';
    	json.data = notifyDeleted;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });

});



module.exports = app;