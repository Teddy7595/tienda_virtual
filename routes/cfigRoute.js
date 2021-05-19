var express = require('express');
var Config = require('../models/configScheme');
var mdAutentication = require('../middleware/autenticacion');

// se inicializa express
var app = express();

var json = 
{ 
	message: 'OK, Im configuration route',
	status: 200, 
	ok: true,
	data: 'OK, Im configuration route'
};

//RUTA QUE ME PERMITE OBTENER TODAS LAS CONFIGRACIONES AGREGADAS
app.get('/',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	Config.find({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = '¡Error en buscar configuraciones! =/';
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Planes de configuraciones encontradas! =/';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'No hay planes de  configuración por el momento =/';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

//RUTA PARA AGREGAR UN NUEVO PLAN CONFIGURACION AL SISTEMA
app.post('/:id?',(req,res,next)=>
{
	var body = req.body;
	
	var socialNet = 
	{
		facebook: body.facebook,
		instagram: body.instagram,
		twitter: body.twitter,
		linkedin: body.linkedin
	};

	var ceo =
	{
		name: body.name,
		photo: body.photo
	};

	var nconfig = new Config
	({
		logo_lg: body.logo_lg,
		logo_sm: body.logo_sm,
		month_price: body.month_price,
		phone: body.phone,
		email: body.email,
		dir:body.dir,
		map:body.map,
		_ceo: ceo,
		_socialNet: socialNet
	});

	if(req.params.id){ nconfig._id =req.params.id;}

	nconfig.save((error,configSaved)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = '¡Plan de configuración agregado! ;-)';
    	json.data = configSaved;
    	json.status = 201;
    	json.ok = true;
    	return res.status(201).json(json);
    });
	
});

//RUTA PARA ACTUALIZAR EL PLAN DE COFIGURACION
app.put('/:id',(req,res,next)=>
{
	var body = req.body;
	
	var socialNet = 
	{
		facebook: body.facebook,
		instagram: body.instagram,
		twitter: body.twitter,
		linkedin: body.linkedin
	};

	var ceo =
	{
		name: body.name,
		photo: body.photo
	};

	Config.findById({_id:req.params.id}, (error,oldConfig)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el plan de configuracion =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!oldConfig) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró el plan de configuración =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}
		
		oldConfig.logo_lg =  body.logo_lg;
		oldConfig.logo_sm =  body.logo_sm;
		oldConfig.month_price =  body.month_price;
		oldConfig.phone =  body.phone;
		oldConfig.email =  body.email;
		oldConfig.di = body.dir;
		oldConfig.map = body.map;
		oldConfig._ceo = ceo;
		oldConfig._socialNet =  socialNet;

		oldConfig.save((err, configSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar el plan de configuracion!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Plan de configuracion modificado!';
    		json.data = configSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
		
		
		//return res.status(200).json(json);
	});

	
});

//RUTA PARA ELIMINAR UN PLAN DE CONDIGUFRACION
app.delete('/:id',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	Config.findByIdAndRemove({_id:req.params.id}, (error, oldConfig)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar el plan de configuracion =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
		}
		
		if (!oldConfig) 
        {
            json.message = 'No se encontró el plan de configuracion =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
		}
		
        json.message = '¡Plan de configuracion eliminada! ;-)';
    	json.data = oldConfig;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });
});

//ruta para insertar imagenes de slider
app.post('slider/:id',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	var slider =
	{
		web: 	req.body.web,
		movil: 	req.body.movil,
		url: 	req.body.url
	};

	Config.findById({_id:req.params.id}, (error,oldConfig)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el plan de configuracion =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!oldConfig) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró el plan de configuración =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}


		oldConfig._slider.push(slider);

		oldConfig.save((err, configSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al añadir imagen al slider =/!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Slider construido!';
    		json.data = configSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});
});

//ruta para modificar slider
app.put('slider/:index/:id',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	var slider =
	{
		web: 	req.body.web,
		movil: 	req.body.movil,
		url: 	req.body.url
	};

	Config.findById({_id:req.params.id}, (error,oldConfig)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el plan de configuracion =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!oldConfig) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró el plan de configuración =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}


		oldConfig._slider[req.params.index] = slider;

		oldConfig.save((err, configSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar imagen del slider!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Slider construido!';
    		json.data = configSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});
});

app.delete('slider/:id',
[mdAutentication.verificaToken ,mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	Config.findById({_id:req.params.id}, (error,oldConfig)=>
	{
		if (error) 
		{
			//if error exists, return the error with status 500
			json.message = 'Error al buscar el plan de configuracion =/';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);
		}

		if (!oldConfig) 
		{
			//if user not exists, return the error with status 400 bad request
			json.message = 'No se encontró el plan de configuración =/';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);
		}


		oldConfig._slider = null;

		oldConfig.save((err, configSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al añadir imagen al slider!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Slider construido!';
    		json.data = configSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
	});
});

app.get('slider/',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRole],
(req,res,next)=>
{
	Config.findById({}).exec((error,response)=>
	{
		if(error)
		{
			json.message = '¡Error en buscar configuraciones! =/';
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Slider encontrado! =)';
		json.data = response._slider;

		if (response._slider.length == 0)
		{ 
			json.message = 'No hay slider configurado =/';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});



module.exports = app;