//ME JALO LAS LIBRERIAS NECESARIAS
var express = require('express');
var Post = require('../models/postScheme');
var moment = require('moment');

var mdAutentication = require('../middleware/autenticacion');
var app = express(); 

var dateMoment = moment().locale('es');

/////////////////////////////////////COMMENT//////////////////////////////////
/*
RUTAS PARA EL CRUD DE COMENTARIO DE LA PUBLICACION, ESTA RUTA MENTENDRÁ SIEMPRE
COMO REQUISITO EL ID DE LA PUBLICACION MAS EL CODIGO DEL USUARIO LOGEADO
*/
/////////////////////////////////////COMMENT//////////////////////////////////

//json maestro que contendrá las respuestas de las peticiones
var json = 
{ 
	message: 'OK, Im post route',
	status: 200, 
	ok: true,
	data: 'OK, Im post route'
};

var comment = 
{
	idUser: null,//codigo del usuario que comento
	userName: null,//nombre del user que comento
	text: null,//comentario
	index: null,//indice del omentario
	created_at: null//fecha de creacion
}

/////////////////////////////////////COMMENT//////////////////////////////////
/*
RUTA PARA RETORNAR COMENTARIO DE LA PUBLICACION EN BASE AL ID DE LA PUBLICACION
*/
/////////////////////////////////////COMMENT//////////////////////////////////
app.get('/:p',(req,res,next)=>
{
	var p = req.params.p; //recibe el id de la publicacion

	Post.findById({_id:p}, (error,post)=>
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

		json.message = post.comments.length + ' Comentarios';
    	json.data = post.comments;
    	json.status = 200;
    	json.ok = true;

		return res.status(200).json(json);
	});
});

/////////////////////////////////////COMMENT//////////////////////////////////
/*
RUTA PARA AGREGAR COMENTARIO A LA PUBLICACION EN BASE A SU ID 
*/
/////////////////////////////////////COMMENT//////////////////////////////////

app.post('/:p',mdAutentication.verificaToken ,(req,res,next)=>
{
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicacion
	var body = req.body; // recibe el cuerpo del comentario

	comment.idUser =  u; //id de usuario sacado del token
	comment.userName =  'teddy'; //req.usuario.name
	comment.text =  body.text; //cuerpo del comentario
	comment.index =  body.index; //recibe el indice nro del comentario
	comment.created_at =  dateMoment.format('LL');

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

		post.comments.push(comment);
		
		post.save((err, postSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al agregar el comentario!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Comentario Agregado!';
    		json.data = postSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
		
	});
});	

/////////////////////////////////////COMMENT//////////////////////////////////
/*
RUTA DONDE MODIFIQUE EL COMENTARIO EN BASE AL ID DE LA PUBLICACION Y AL ID 
DEL USUARIO Y AL INDICE DEL COMENTARIO
*/
/////////////////////////////////////COMMENT//////////////////////////////////
app.put('/:p/:i',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser] 
,(req,res,next)=>
{
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicacion
	var i = req.params.i; //recibe el index del comentario, es decir el nodo del array
	var body = req.body; // recibe el cuerpo del comentario

	comment.idUser =  u; //id de usuario sacado del token 
	comment.userName = req.usuario.name; // nombre del usuario que comento
	comment.text =  body.text; //cuerpo del comentario
	comment.created_at =  dateMoment.format('LL');

	Post.findById({_id:p}, (error,post)=>
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

		post.comments[i] = comment;
		
		post.save((err, postSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al modificar el comentario!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Comentario modificado!';
    		json.data = postSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
		
	});

});

/////////////////////////////////////COMMENT//////////////////////////////////
/*
RUTA QUE BORRA COMENTARIOS EN BASE AL ID DEL POST, INDICE DEL COMENTARIO Y EL
ID DEL USUARIO
*/
/////////////////////////////////////COMMENT//////////////////////////////////
app.delete('/:p/:i'
,[mdAutentication.verificaToken, mdAutentication.verificaAdminRoleoMismoUser]
,(req,res,next)=>
{
	var u = req.usuario._id; //recibe el id del usuario
	var p = req.params.p; //recibe el id de la publicacion
	var i = req.params.i; //recibe el index del comentario, es decir el nodo del array

	Post.findById({_id:p}, (error,post)=>
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

		post.comments = post.comments.filter((item)=>{ return item.index != i;});
		
		post.save((err, postSaved)=>
        {
            if (err) 
            {
            	//if exists problem for update user, return sttus 400

                json.message = '¡Error al eliminar el comentario!';
                json.data = null;
                json.status = 400;
                json.ok = null;

                return res.status(400).json(json);    
            }

            json.message = '¡Comentario eliminado!';
    		json.data = postSaved;
    		json.status = 200;
    		json.ok = true;

            return res.status(200).json(json);
        });
		
	});

});
module.exports = app;