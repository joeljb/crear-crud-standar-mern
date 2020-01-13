

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../Config/config";
import User from "./modelo";

class AuthControlador {

   async login(req, res) {

      const { email, password } = req.body;
      try {
         let user = await User.findOne({ email });
         if (!user) return res.status(400).json({
            message: "Usuario no existe"
         });

         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(400).json({
            message: "Incorrect Password !"
         });

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
      } catch (e) {
         console.error(e);
         res.status(500).json({
            message: "Server Error"
         });
      }
   }
}

export default new AuthControlador();