import mongoose from 'mongoose';

const Schema = mongoose.Schema;
mongoose.set('useCreateIndex', true);

var UserSchema = new Schema({
   username: {
      type: String,
      unique: true,
      required: true
   },
   email: {
      type: String,
      unique: true,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   tipo_usuario: {
      type: String,
      enum: ['usuario', 'admin', 'superadmin'],
      required: true
   },
   createdAt: {
      type: Date,
      default: Date.now()
   }
}, {
   timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

export default mongoose.model('User', UserSchema);