import express from 'express';

import path from 'path';

import middlewares from '../../Servicios/middleware';

import Usuarios from './Usuarios.js';
import Auth from './auth.js';

   var router = express.Router()

   router.get('/usuarios',/*  middlewares.auth, */ Usuarios.consultar);
   router.get('/usuario/:id',/*  middlewares.auth, */ Usuarios.consultarId);
   router.post('/usuario/crear', Usuarios.crear);
   router.post('/usuario/crear_admin', middlewares.authAdmin, Usuarios.crearAdmin);
   router.put('/usuario/editar',/*  middlewares.auth, */ Usuarios.editar);
   router.post('/login', Auth.login);

export default router;