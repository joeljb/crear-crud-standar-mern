import express from 'express';

import path from 'path';

import middlewares from '../../Servicios/middleware';

import Productos from './Productos.js';

   var router = express.Router()

   router.get('/productos', /* middlewares.auth, */ Productos.consultar);
   router.get('/producto/:id',/*  middlewares.auth, */ Productos.consultarId);
   router.post('/producto/crear',/*  middlewares.auth, */ Productos.crear);
   router.put('/producto/editar',/*  middlewares.auth, */ Productos.editar);
   router.delete('/producto/eliminar',/*  middlewares.auth, */ Productos.eliminar);

export default router;