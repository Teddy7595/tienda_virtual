//Obtenemos las importaciones
var express = require('express');
var bcrypt = require('bcryptjs');
var moment = require('moment');
var User = require('../models/userScheme');

var dateMoment = moment().locale('es');
var mdAutentication = require('../middleware/autenticacion');

//inicializamos express
var app = express();

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im user route',
	status: 200, 
	ok: true,
	data: 'OK, Im user route'
};


//ROUTE GET USERS
app.get('/',(req,res,next)=>
{
	User.find({}, 'name email img role').exec((error, response)=>
	{
		if(error)
		{
			json.message = 'No se pudo conseguir usuarios registrados =/';
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = 'Usuarios encontrados!!';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Usuarios no encontrados';
			json.data = null;
		}

		json.status = 201;
		json.ok = true;
		return res.status(201).json(json);
	});
});

//ROUTE POST USERS
app.post('/',(req,res, next)=>
{
	var body = req.body;
    var user = new User
    ({
        name: body.name,
        email: body.email,
        pass: bcrypt.hashSync(body.pass,10),
        img: body.img,
		role: body.role,
		status: true,
        type: body.type
    });

    user.save((error,user)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = 'Usuario agregado!';
    	json.data = user;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });

});

//ROUTES PUT USERS By ID
app.put('/:id', 
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRoleoMismoUser], 
(req,res,next)=>
{
	var id = req.params.id;
	var body = req.body;

	User.findById(id, (error,user)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el usuario';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!user) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró al usuario';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}

		user.name = body.name;
        user.pass = body.pass;
        user.update_at = dateMoment.format('LL');

        user.save((err, userSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar usuario!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }
            
            userSaved.pass = ';-)';

            json.message = 'Usuario modificado!';
    		json.data = userSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});

});

//ROUTE TO DELETE USER BY ID

app.delete('/:id',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRoleoMismoUser], 
(req, res, next)=>
{
    var id = req.params.id;
    
    User.findByIdAndRemove(id, (error, userDeleted)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar el usuario';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
        }

        if (!userDeleted) 
        {
            json.message = 'No se encontró al usuario';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
        }

        json.message = 'Usuario eliminado!';
    	json.data = userDeleted;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });
});


//export route users module
module.exports = app; 