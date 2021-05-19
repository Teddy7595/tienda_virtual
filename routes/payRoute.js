var express = require('express');
var app = express();

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: 'OK, Im post route'
};

app.post('/', 
async (req, res, next) => 
{

    return res.status(200).json(json);
});

module.exports = app;

