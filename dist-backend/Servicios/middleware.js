import passport from 'passport';
import config from '../Config/config';
import jwt from "jsonwebtoken";
import error_types from '../Controladores/error_types';

class middlewares {

   auth(req, res, next) {
      const token = req.header("Token");
      if (!token) throw new error_types.Error401("Token no enviado");
      try {

         const decoded = jwt.verify(token, config.secret, {
            algorithm: config.alg
         });

         req.user = decoded.user;

         next();
      } catch (e) {
         console.error(e);
         throw new error_types.InfoError(e);
      }
   }
   authAdmin(req, res, next) {
      const token = req.header("Token");
      if (!token) throw new error_types.Error401("Token no enviado");
      try {

         const decoded = jwt.verify(token, config.secret, {
            algorithm: config.alg
         });

         req.user = decoded.user;

         next();
      } catch (err) {
         throw new error_types.Error500(err);
      }
   }

   /*
      Este middleware va al final de todos los middleware y rutas.
      middleware de manejo de errores.
   */

   errorHandler(error, req, res, next) {
      console.log("ejecutando middleware de control de errores");
      if (error instanceof error_types.InfoError) res.status(200).json({ success: false, error: error.message });else if (error instanceof error_types.Error404) res.status(404).json({ success: false, error: error.message });else if (error instanceof error_types.Error403) res.status(403).json({ success: false, error: error.message });else if (error instanceof error_types.Error401) res.status(401).json({ success: false, error: error.message });else if (error.name == "ValidationError") //de mongoose
         res.status(200).json({ success: false, error: error.message });else if (error.message) res.status(500).json({ success: false, error: error.message });else next();
   }

   /*
      Este middleware va al final de todos los middleware y rutas.
      middleware para manejar notFound
   */

   notFoundHandler(req, res, next) {
      console.log("ejecutando middleware para manejo de endpoints no encontrados");
      res.status(404).json({ error: "Url no encontrada" });
   }

}

export default new middlewares();