var express = require('express');
var cron = require('node-cron');
var moment = require('moment');
var Post = require('../models/postScheme');
var dateMoment = moment().locale('es');
var mdAutentication = require('../middleware/autenticacion');

// se inicializa express
const app = express();

//esta establecido para arrncar cada dia
const task = cron.schedule("00 30 2 */1 * *", function() 
{
    let day = new moment().locale('es');
    console.log('\n');
    console.log('//////////////////////////////|',day.format('dddd Do MMMM YYYY hh:mm:ss a'),'|/////////////////////////////////////');
    setDaysReaming();
},
{
    scheduled:true,
    timezone:'America/Bogota'

}).start();


app.post('/systemClock',
[mdAutentication.verificaToken, mdAutentication.verificaAdminRole ],
(req, res, next) => 
{
    var init = req.body.key;

    if(init === 'start')
    {
        task.start();
        console.log('Tarea iniciada!');
        return res.status(200).json('¡Tarea iniciada!');
    }

    if(init === 'stop')
    {
        task.stop();
        console.log('Tarea detenida!');
        return res.status(200).json('¡Tarea detenida!');
    }

    if(init === 'clean')
    {
        task.destroy();
        console.log('¡Tarea borrada de la palestra de sistema!');
        return res.status(200).json('¡Tarea borrada de la palestra de sistema!');
    }

});

function setDaysReaming() 
{
    //me jalo toda la data y con foreach los trato individualmente
    Post.find({}).populate('user').exec((error,post)=>
	{
        if(error){ console.log( "Hubo un error en la obtencio de los datos");}

        if(!post.length){ console.log('NO HAY REGISTROS HASTA EL MOMENTO'); console.clear();}

        if(post)
        {
            post.forEach((index)=>
            {
                
                index.days = index.days -1;
                index.updated_at = dateMoment.format('LL');
                index.user.pass = '***********************************';

                //console.log(index);
                
                if(index.days <= 0)
                {
                    //si los dias son iguales a 0, entonces el post ya no es visible
                    index.days = 0;
                    index.status = false;
                }

                index.save((err, postSaved)=>
                {
                    if (err) { console.log('Error critico: ' + err);} 
                    if(postSaved)
                    {
                        controlTime(postSaved);
                        console.log('-----------------------------------------------------------------------------------------------|\n');
                    }
                });
            });
        }    
    });
}

function controlTime(postSaved) 
{
    switch (postSaved.days) 
    {
        case 0:
            console.log('Publicación: ',postSaved._id,'Nombre: ',postSaved.title,'Status: Publicación suspendida');
            sendNotify(postSaved, 'Ha expirado la publicaciòn, por favor renueve');
        break;

        case 7:
            console.log('Publicación: ',postSaved._id,'Nombre: ',postSaved.title,'Status: 7dias por vencer');
            sendNotify(postSaved, 'Le queda 7dias para que su publicación expire, por favor renueve');
        break;

        case 14:
            console.log('Publicación: ',postSaved._id,'Nombre: ',postSaved.title,'Status: 14dias por vencer');
            sendNotify(postSaved, 'Le queda 14dias para que su publicación expire, por favor renueve');
        break;

        default:
            console.log('Publicacion: ',postSaved._id,'Nmmbre: ',postSaved.title,' Dias restantes: ',postSaved.days, ' Status: ',postSaved.status);
        break;
    }  
}


function sendNotify(objetPost, message)
{
    //funcion que llama al algoritmo de notificacion por correo
    console.log(message);
}

module.exports = app;
