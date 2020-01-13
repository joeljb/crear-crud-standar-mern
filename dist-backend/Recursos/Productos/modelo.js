import mongoose from 'mongoose';

var productoSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   nombre: {
      type: String,
      require: true
   },
   precio: {
      type: Number,
      require: true
   },
   descripcion: {
      type: String,
      require: true
   },
   created: {
      type: Date,
      default: Date.now
   }
});

var Producto = mongoose.model('Producto', productoSchema);

export default Producto;