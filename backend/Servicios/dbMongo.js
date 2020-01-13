import mongoose from 'mongoose'; //importamos mongoose
import config from '../Config/config'; // traer fila de configuracion

const dbMongo = async () => {
   try {
      await mongoose.connect(config.mongo_uri, { 
         useNewUrlParser: true, 
         useUnifiedTopology: true,  
         useCreateIndex: true,
      });
      console.log("base de datos conectada");
   } catch (e) {
      console.log(e);
      throw e;
   }
};

export default dbMongo;