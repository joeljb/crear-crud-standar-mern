import express from 'express';

import path from 'path';

import middlewares from './Servicios/middleware';

var router = express.Router();

router.get("/imagenes/:id", (req, res) => {
   return res.sendFile(path.join(__dirname, "../files/" + req.params.id));
});

export default router;