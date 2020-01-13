//importamos express framework principal
// import express from 'express';

//importamos cors para dar acceso 
import cors from 'cors';

//importamos body-parser para reciber json
import bodyParser from 'body-parser';

//importamos para trabajar con http
import http from 'http';

import dbMongo from './Servicios/dbMongo'; //importamos el modulo demongo db

import middlewares from './Servicios/middleware' //importamos los middlewares

import config from './Config/config'; // importamos el archivo de configuracion

import app from './appRouter'; // importamos a router 

//importamos la ruta de programdor
import routerProgramador from './Controladores/Programador/routerProgramador';

dbMongo() //iniciamos la conexion de mongodb

//creamo el servidor
var server = http.Server(app);

//usamos cors para dale acceso a todos lo origenes
app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/programador', routerProgramador);

app.use(middlewares.errorHandler);
app.use(middlewares.notFoundHandler);

server.listen(config.port,()=>{
   console.log('Corriendo en el puerto: ' + config.port);
});