

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../Config/config";
import User from "./modelo";

class UsuarioControlador {
   async consultar(req, res) {
      try {

         User.find().sort('-createdAt').limit(5).exec(function (err, usuarios) {
            if (err) throw err;

            return res.json({ success: true, data: usuarios });
         });
      } catch (e) {
         // console.log(e)
         return res.json({ success: false, error: e });
      }
   }
   async consultarId(req, res) {
      try {
         User.findById(req.params.id, function (err, usuario) {
            if (err) {
               console.log(err.message);
               return res.json({ success: false, error: err });
            };

            return res.json({ success: true, data: usuario });
         });
      } catch (e) {
         return res.json({ success: false, error: e });
      }
   }
   async crear(req, res) {
      const { username, email, password } = req.body;
      try {
         let userEmail = await User.findOne({ email });

         if (userEmail) {
            return res.status(400).json({
               msg: "User Already Exists"
            });
         }
         console.log(username);
         let userName = await User.findOne({ username });

         if (userName) {
            return res.status(400).json({
               msg: "Username Already Exists"
            });
         }

         let user = new User({
            username,
            email,
            password,
            tipo_usuario: 'usuario'
         });

         const salt = await bcrypt.genSalt(config.rounds);
         user.password = await bcrypt.hash(password, salt);

         await user.save();

         const payload = {
            user: {
               id: user.id
            }
         };

         jwt.sign(payload, config.secret, {
            expiresIn: config.expire,
            algorithm: config.alg
         }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
               token
            });
         });
      } catch (err) {
         console.log(err.message);
         res.status(500).send("Error in Saving");
      }
   }

   async crearAdmin(req, res) {
      const { username, email, password } = req.body;
      try {
         let userEmail = await User.findOne({ email });

         if (userEmail) {
            return res.status(400).json({
               msg: "User Already Exists"
            });
         }

         let userName = await User.findOne({ username });

         if (userName) {
            return res.status(400).json({
               msg: "Username Already Exists"
            });
         }

         let user = new User({
            username,
            email,
            password,
            tipo_usuario: 'administrador'
         });

         const salt = await bcrypt.genSalt(config.rounds);
         user.password = await bcrypt.hash(password, salt);

         await user.save();

         const payload = {
            user: {
               id: user.id
            }
         };

         jwt.sign(payload, config.secret, {
            expiresIn: config.expire,
            algorithm: config.alg
         }, (err, token) => {
            if (err) throw err;
            res.status(200).json({
               token
            });
         });
      } catch (err) {
         console.log(err.message);
         res.status(500).send("Error in Saving");
      }
   }

   async editar(req, res) {
      try {
         var datos = req.body;

         User.findById(datos.id, function (err, user) {
            if (err) {
               console.log(err.message);
               return res.json({ success: false, error: err });
            };

            return res.json({ success: true, data: user });

            //definir los campos que se van a poder editar

            // if (datos.nombre) {
            //    producto.nombre = datos.nombre
            // } else if (datos.precio) {
            //    producto.precio = datos.precio
            // }
            // else if (datos.precio) {
            //    producto.descripcion = datos.descripcion
            // }

            // producto.save(function (err, producto) {
            //    if (err) throw err;

            //    console.log('Author updated successfully');

            //    return res.json({ success: true, data: producto });
            // });
         });
      } catch (e) {
         return res.json({ success: false, error: e });
      }
   }
}

export default new UsuarioControlador();