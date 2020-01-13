import mongoose from 'mongoose';

let recursoSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   nombre_recurso: {
      type: 'String',
      unique: true,
      required: true,
      max: 50
   },

   nombre_visual: {
      type: 'String',
      required: true,
      max: 50
   },

   descripcion_recurso: {
      type: 'String',
      required: true
   },

   estatus_recurso: {
      type: 'String',
      required: true,
      enum: ['ACTIVO;INACTIVO'],
      default: 'ACTIVO'
   },

   campos: {
      nombre_recurso: {
         type: 'String',
         unique: true,
         required: true,
         max: 50
      }
   },

   created: {
      type: Date,
      default: Date.now
   }
});

var Recurso = mongoose.model('Recurso', recursoSchema);

export default Recurso;