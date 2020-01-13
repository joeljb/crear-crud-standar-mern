require('dotenv').config();

export default {
   'port':process.env.PORT || 3500,
   'secret':process.env.SECRET || 'my secret',
   'mongo_uri': process.env.MONGO_URI || "mongodb://localhost/prueba",
   'alg':process.env.JWT_ALGORITHM || 'HS256',
   'rounds': parseInt(process.env.BCRYPT_ROUNDS) || 10,
   'expire': process.env.JWT_LIFETIME || 86400
};