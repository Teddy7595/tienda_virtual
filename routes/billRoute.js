var express         = require('express');
var Bill            = require('../models/billScheme');
var Post            = require('../models/postScheme');
var User            = require('../models/userScheme');
var moment          = require('moment');
var mdAutentication = require('../middleware/autenticacion');
var dateMoment      = moment().locale('es');

var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: 'OK, Im post route'
};

// se inicializa express
var app = express();

app.get('/', (req, res, next) => 
{
    Bill.find().exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Facturas encontradas!';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Facturas no encontradas';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

app.get('/:id', (req, res, next) => 
{
    var id = req.params.id;

    Bill.find({'userId':id}).exec((error,response)=>
	{
		if(error)
		{
			json.message = error;
			json.status = 500;
			json.data = null;
			json.ok = false;
			return res.status(500).json(json);
		}

		json.message = '¡Facturas encontradas!';
		json.data = response;

		if (response.length == 0)
		{ 
			json.message = 'Facturas no encontradas';
			json.data = null;
		}

		json.status = 200;
		json.ok = true;
		return res.status(200).json(json);
	});

});

app.post('/:post/:user', async(req, res, next) => 
{
    var body = req.body;
    var postBill = await Post.findById(req.params.post);
    var userBill = await User.findById(req.params.user);

	var bill = new Bill
	({
        post          : postBill,
        userId        : body.userId,
        user          : userBill,
        description   : body.description,
        mount         : body.mount,
        created_at    : dateMoment('LL')
	});

	Bill.save((error, billSaved)=>
    {
    	if (error) 
    	{
    		json.message = error;
    		json.data = null;
    		json.status = 400;
    		json.ok = false;
    		return res.status(400).json(json);
    	}

    	json.message = '¡Facturado!';
    	json.data = billSaved;
    	json.status = 201;
        json.ok = true;
        
    	return res.status(201).json(json);
    });
});

app.delete('/:bill',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRole], 
(req, res, next) => 
{
    Bill.findByIdAndRemove({_id:req.params.bill}, (error, billDeleted)=>
    {
        if (error) 
        {
            json.message = 'Error al buscar la notificación';
			json.data = null;
			json.status = 500;
			json.ok = false;

			return res.status(500).json(json);  
		}
		
		if (!billDeleted) 
        {
            json.message = 'No se encontró la notificación';
			json.data = null;
			json.status = 400;
			json.ok = false;

			return res.status(400).json(json);  
		}
		
        json.message = '¡Notificación eliminada!';
    	json.data = billDeleted;
    	json.status = 200;
    	json.ok = true;

        return res.status(200).json(json);
    });

});


module.exports = app;

