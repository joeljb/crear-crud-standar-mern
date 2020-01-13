import express from 'express';
import path from 'path';

import middlewares from '../../Servicios/middleware';

var router = express.Router();

import ProgramadorControlador from './ProgramadorControlador';

router.get('/recursos', ProgramadorControlador.consultar);
router.post('/recurso/crear', ProgramadorControlador.crear);
router.delete('/recurso/eliminar', ProgramadorControlador.eliminar);

export default router;