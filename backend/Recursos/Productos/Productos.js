import mongoose from 'mongoose';
import Producto from './modelo';

import error_types from '../../Controladores/error_types';

class ProductoControlador{
	async consultar(req, res){
		try{
         Producto.find().sort('-created')
         .limit(5)
         .exec(function(err, productos) {
            if (err) throw new error_types.InfoError(err);
            
            return res.json({success:true,data:productos})
         });

      } catch (err){
         throw new error_types.InfoError(err);
		}
	}
	async consultarId(req, res){
		try{
			Producto.findById(req.params.id, function(err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };
            return res.json({success:true,data:producto})
         });
			
		}catch(err){
         throw new error_types.InfoError(err);
		}
	}
	async crear(req, res){
		try{
         var datos = req.body;

         console.log(datos)
         var crearProducto = new Producto({
               _id: new mongoose.Types.ObjectId(),
               nombre: datos.nombre,
               precio:datos.precio,
               descripcion:datos.descripcion,
         });

         crearProducto.save(function(err) {
               if (err) {
                  throw new error_types.InfoError(err);
               }
               console.log('Producto guardado.');
         })

			return res.json({success:true,data:crearProducto});
		}catch(err){
         throw new error_types.InfoError(err);
		}
	}
	async editar(req, res){
		try{
         var datos = req.body;

         Producto.findById(datos.id, function(err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };
               
            if(datos.nombre){
               producto.nombre = datos.nombre
            }else if(datos.precio){
               producto.precio = datos.precio
            }
            else if(datos.precio){
               producto.descripcion = datos.descripcion
            }
            
            producto.save(function(err,producto) {
               if (err) throw err;
               
               console.log('Author updated successfully');

               return res.json({success:true,data:producto});
            });
         });
			
		}catch(err){
         throw new error_types.InfoError(err);
		}
	}
		
	async eliminar(req, res){
		try{
         var datos = req.body;
			Producto.findById(datos.id, function(err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };

            if(producto){
               producto.delete(function(err,producto) {
                  if (err) throw err;
                  
                  return res.json({success:true,data:producto});
               });
            }else{
               throw "id: " + datos.id + " no encontrado";
            }
            
         });
		}catch(err){
         throw new error_types.InfoError(err);
		}
	}
}
export default new ProductoControlador;
