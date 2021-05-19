var express = require('express');
var mdAutentication = require('../middleware/autenticacion');
var NewsLtr = require('../models/nslrScheme');
// se inicializa express
var app = express();

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: 'OK, Im post route'
};

app.get('/',
[mdAutentication.verficaUrl, mdAutentication.verificaAdminRole], 
(req, res, next) => 
{
    NewsLtr.find({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Correos encontrados!';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Correos no encontradas';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});
});

//RUTA PARA GUARDAR 
app.post('/',
(req, res, next) => 
{
    var body = req.body;
    
	var newsLtr = new NewsLtr({ email: body.email });

	newsLtr.save((error,nslrSaved)=>
    {
    	if (error) 
    	{
    		json.message = "No se pudo guardar tu correo en nuesra bandeja de contactos =(";
    		json.data = null;
    		json.status = 500;
    		json.ok = false;
    		return res.status(500).json(json);
    	}

    	json.message = '¡Estupendo! correo añadido a nuestra bandeja de comunicados =)';
    	json.data = nslrSaved;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });
});

module.exports = app;


