//--------

// Requires - son importaciones de librerias que hacen falta para que funcionen cosas.
var express = require("express"),
  // libreria moongoose
  mongoose = require("mongoose"),
  // importación de bodyparser para el uso de envio de formularios en post
  bodyParser = require("body-parser"),
  // ------------
  // cors
  cors = require("cors"),
  // inicializar las variables necesarias
  // se inicializa express
  app = express();


// se trae el enabled cors para poder configurar de donde se van a permitir las peticiones http
// hay que investigar despues mas a fondo para condicionar de mejor manera esto.
app.use(cors());





// se usa el bodyparser cualquier form post que llegue
app.use(app.json({
  limit: '50mb'
}));

app.use(app.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: false 
}));

// importar rutas
var appRoutes =     require('./routes/appRoutes');
var usrRoutes =     require('./routes/userRoute');
var lgnRoutes =     require('./routes/loginRoute');
var pstRoutes =     require('./routes/postRoute');
var vrfRoutes =     require('./routes/verifyRoute');
var cfgRoutes =     require('./routes/cfigRoute');
var fndRoutes =     require('./routes/findRoute');
var catRoutes =     require('./routes/categoryRoute');
var ntfRoutes =     require('./routes/notifyRoute');
var mbpRoutes =     require('./routes/membershipRoute');
var cmtRoutes =     require('./routes/commentsRoute');
var rnkRoutes =     require('./routes/rnkRoute');
var lkdRoutes =     require('./routes/likeRoute');
var systemRoutes =  require('./routes/systemRoute');
var cntRoutes =     require('./routes/cntRoute');
var nwlRoutes =     require('./routes/nwlRoute');
var payRoutes =     require('./routes/payRoute');

// // conexion a base de datos con mongoose
mongoose.connection.openUri('mongodb://localhost:27017/Pymes', (err, res) => 
{
  // si hay un error entonces
  if (err) throw err;
  console.log('Base de datos Mongo: \x1b[32m', 'En linea', '\x1b[0m');
});

// rutas
// se ejecuta algo que se ejecuta antes del proceso de rutas
app.use('/user',          usrRoutes);     // Ruta de usuarios
app.use('/login',         lgnRoutes);     // Ruta de login
app.use('/post',          pstRoutes);     // Ruta de publicaciones
app.use('/config',        cfgRoutes);     // Ruta de configuracion administrativa
app.use('/find',          fndRoutes);     //Ruta de busqueda de archvos
app.use('/category',      catRoutes);     //Ruta de categorias para publicaciones
app.use('/notify',        ntfRoutes);     //Ruta de notificaciones para publicaciones
app.use('/membership',    mbpRoutes);     //Ruta de gestion de membresias
app.use('/verify',        vrfRoutes);     //Ruta para la verificacion en gral de elementos en la pagina
app.use('/post/comments', cmtRoutes);     //Ruta para comentar publicaciones
app.use('/post/ranking',  rnkRoutes);     //Ruta encargada de los like/dislike y la cantidad de visitas
app.use('/post/reaction', lkdRoutes);     //Ruta encargada de gestionar las reacciones en la publicacion
app.use('/system',        systemRoutes);  //Ruta encargada de supervisar el sistema de reloj
//app.use('/contac_us',     cntRoutes);     //Ruta encargada de generar correo para contacto
app.use('/newsLetter',    nwlRoutes);     //Ruta encargada de generar correos masivo
app.use('/payment',       payRoutes);


app.use('/', appRoutes);
 // escuchar peticiones de express
app.listen(3031, () => 
{
  console.log(" ");
  console.log('Servidor Node-Express: \x1b[32m', 'En linea localhost:3031', '\x1b[0m');
});

