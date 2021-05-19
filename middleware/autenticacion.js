var url = require('url');
 // se importa el jasonwebtoken
 var jwt = require('jsonwebtoken');
 // se jala el seed pre configurado por defecto
 var SEED = require('../config/config').SEED;


 var json = 
 { 
     message: null,
     status: 200, 
     ok: null,
     data: null
 };

 // para bloquear peticiones por medio de token se hara esto
 /* -------------------------------------
     <- Verificar token ->
     Descripción: Se lee el token y se recibe
     del url, se procesa y si es valido entonces
     se continua.
   --------------------------------------- */

 exports.verificaToken = function (req, res, next) 
 {

     // se tiene el token a la mano
     var token = req.query.t;
     // el primer parametro es el token que se recibe de la peticion
     // el segundo es el seed y el tercero es el callback
     jwt.verify(token, SEED, (err, decoded) => 
     {
         if (err) 
         {
             // 401 es unautorized
             return res.status(401).json
             ({
                 ok: false,
                 mensaje: 'Token no valido',
                 errors: err
             });
         }
         // el next verifica y valida que se siga con los procesos
         // se manda el usuario quien hace la petición de esta forma, se inyecta en el request.
         req.usuario = decoded.user;
         // req.prueba = decoded;

         next();

          //return res.status(200).json({
          //    ok: true,
          //    decoded: decoded
          //});
     });


}

 // verifica admin
 exports.verificaAdminRole = function (req, res, next) 
 {

     var usuario = req.usuario;

     if (usuario.role === 'ADMIN_ROLE') 
     {
         // si es valido entonces continua.
         next();
         return;
     } else 
     {
         // si no es administrativo entonces
         return res.status(401).json(
         {
             ok: false,
             mensaje: 'Invalido No es administrador.',
             errors: 
             {
                 message: 'Usuario no administrador'
             }
         });
     }



 }

 // verifica admin o mismo usuario
 exports.verificaAdminRoleoMismoUser = function (req, res, next) 
 {


     var usuario = req.usuario;

     var id = req.params.id;

     if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) 
     {
         // si es valido entonces continua.
         next();
         return;
     } else 
     {
         // si no es administrativo entonces
         return res.status(401).json(
         {
             ok: false,
             mensaje: 'Invalido No es administrador ni es el mismo usuario.',
             errors: {
                 message: 'Usuario no administrador'
             }
         });
     }
 }

exports.verficaUrl = function(req, res, next)
{

    var trigger = null; //variable que tendra la direccion permitida para obtener los datos de la API
    var httpIncoming = url.parse(req.url, true);
    /* 
     * httpIncoming le falta una propiedad del urlparse que devuelva la url completa y asi poder
     * condicionar el middleware 
    */

    return res.status(200).json(httpIncoming);

    if(trigger === httpIncoming)
    {
        next();
    }
    else
    {
        return res.status(400).json('<h2> CLIENTE NO PERMITIDO, ACCESO DENEGADO!! ;-) </h2>');
    }
}