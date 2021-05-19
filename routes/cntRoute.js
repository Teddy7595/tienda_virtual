var express = require('express');
var moment = require('moment');

var dateMoment = moment().locale('es');
//inicializamos express
var app = express();

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: null
};

app.post('/',(req,res,next)=>
{
    var body = req.body;

    var email   = body.email;
    var name    = body.name;
    var phone   = body.phone;
    var text    = body.text;
    
    if (!email)
    { 
        json.message = 'Debe dar un correo para contactarlo';
        return res.status(200).json(json);
    }

    if (!name)
    { 
        json.message = 'Debe dar un nombre para contactarlo';
        return res.status(200).json(json);
    }

    if (!phone)
    { 
        json.message = 'Debe dar un teléfono para contactarlo';
        return res.status(200).json(json);
    }

    if (!text)
    { 
        json.message = 'Debe escribir algo para contactarlo';
        return res.status(200).json(json);
    }


    return res.status(200).json(json);
});