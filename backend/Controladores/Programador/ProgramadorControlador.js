import mongoose from 'mongoose';
import Recurso from './ModeloRecurso';
import error_types from '../error_types';

class ProgramadorControlador {
   
   async consultar(req, res) {
      try {
         Recurso.find().sort('-created')
            .limit(5)
            .exec(function (err, productos) {
               if (err) throw new error_types.InfoError(err);

               return res.json({ success: true, data: productos })
            });

      } catch (err) {
         throw new error_types.InfoError(err);
      }
   }

   async consultarId(req, res) {
      try {
         Producto.findById(req.params.id, function (err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };
            return res.json({ success: true, data: producto })
         });

      } catch (err) {
         throw new error_types.InfoError(err);
      }
   }
   async crear(req, res) {
      try {
         var datos = req.body;

         console.log(datos)
         var crearProducto = new Producto({
            _id: new mongoose.Types.ObjectId(),
            nombre: datos.nombre,
            precio: datos.precio,
            descripcion: datos.descripcion,
         });

         crearProducto.save(function (err) {
            if (err) {
               throw new error_types.InfoError(err);
            }
            console.log('Producto guardado.');
         })

         return res.json({ success: true, data: crearProducto });
      } catch (err) {
         throw new error_types.InfoError(err);
      }
   }
   async editar(req, res) {
      try {
         var datos = req.body;

         Producto.findById(datos.id, function (err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };

            if (datos.nombre) {
               producto.nombre = datos.nombre
            } else if (datos.precio) {
               producto.precio = datos.precio
            }
            else if (datos.precio) {
               producto.descripcion = datos.descripcion
            }

            producto.save(function (err, producto) {
               if (err) throw err;

               console.log('Author updated successfully');

               return res.json({ success: true, data: producto });
            });
         });

      } catch (err) {
         throw new error_types.InfoError(err);
      }
   }

   async eliminar(req, res) {
      try {
         var datos = req.body;
         Producto.findById(datos.id, function (err, producto) {
            if (err) {
               throw new error_types.InfoError(err);
            };

            if (producto) {
               producto.delete(function (err, producto) {
                  if (err) throw err;

                  return res.json({ success: true, data: producto });
               });
            } else {
               throw "id: " + datos.id + " no encontrado";
            }

         });
      } catch (err) {
         throw new error_types.InfoError(err);
      }
   }
}
export default new ProgramadorControlador;


// //modulo para consultar a la base de datos.
// const db = require('../../Servicios/db.js');
// const ValidarCampos = require('../../Servicios/ValidarCampos.js');
// const VerificarRecurso = require('./VerificarRecurso.js');
// const CrearRecurso = require('./crearRecurso.js');
// const CrearInterfaz = require('./Interfaz/crearInterfaz.js');
// const bcrypt = require('bcrypt');
// const fs = require('fs');
// const util = require('../../Servicios/utils.js');

// const programadorServicios = require("./ProgramadorServicios.js");

// module.exports = {
// 	consultar: async (req, res) =>{//funcion para consultar todos los recursos creados
// 		try{
// 			var con = req.app.settings.con
// 			var consulta = await db.consultar(con,"select * from recursos",[]);
// 			return res.json({success:true,data:consulta.rows})
// 		}catch(e){
// 			return res.json({success:false,error:e})
// 		}
// 	},
// 	crear: async (req, res) =>{//funcion para crear un nuevo recurso
// 		try{
// 			var datos = req.body;	

//          console.log (datos)
// 			var con = req.app.settings.con;
			

//          var nombreRuta = `${datos.nombre_recurso.slice(0,1).toUpperCase()}${datos.nombre_recurso.slice(1)}`;

// 			var rutaCarpeta = `src/Controladores/${nombreRuta}`;
// 			var rutaArchivo = `${rutaCarpeta}/${nombreRuta}.js`;
// 			var rutaArchivoModelo = `${rutaCarpeta}/Modelo.js`;
// 			var verificarRecurso = await VerificarRecurso(con,datos,rutaArchivo,rutaArchivoModelo,nombreRuta);

// 			var validarCampos = await ValidarCampos(datos,'Programador');
//                console.log(datos)

// 			if (!fs.existsSync(rutaCarpeta)) {
// 				fs.mkdirSync(rutaCarpeta);
// 			}

// 			let SQL = "insert into recursos (nombre_recurso,nombre_visual,descripcion_recurso,campos,status_recurso) values ($1,$2,$3,$4,$5)";
// 			var consulta = await db.consultar(con,SQL,[datos.nombre_recurso,datos.nombre_visual,datos.descripcion_recurso,JSON.stringify(datos.campos),'ACTIVO']);
//                console.log(consulta)

// 			var crearRecurso = await CrearRecurso(con,datos,rutaArchivo,nombreRuta,rutaArchivoModelo);

//          var crearInterfaz = await CrearInterfaz(datos);
			

//          return res.json({success:true,data:"proceso realizado con exito"});
// 		}catch(error){
//          console.log(error)
// 			return res.json({success:false,error});
// 		}
// 	},
// 	eliminar: async(req,res)=>{
// 		try{
// 			var datos = req.body;	
// 			var con = req.app.settings.con;

			
// 			var SQL = "select * from recursos where id_recurso=$1";
// 			var consulta = await db.consultar(con,SQL,[datos.id_recurso]);
//          consulta = consulta.rows;

// 			if (consulta.length<=0) {
// 				throw util.crearError ('ELI001',"NO SE ENCONTRO EL ID: "+datos.id_recurso);
// 			}

//          var nombreRuta = `${consulta[0].nombre_recurso.slice(0,1).toUpperCase()}${consulta[0].nombre_recurso.slice(1)}`;

//          var rutaCarpeta = `src/Controladores/${nombreRuta}`;

//          if(consulta[0].nombre_recurso.slice(-2)=='es'){
//             var nombre = consulta[0].nombre_recurso.slice(0,-2);
//          }else if(consulta[0].nombre_recurso.slice(-1)=='s'){
//             var nombre = consulta[0].nombre_recurso.slice(0,-1);
//          }else{
//             var nombre = consulta[0].nombre_recurso;
//          }


//          /********************eliminar interfaz*****************/
//          var rutaInterfaz = "/home/joeljb/dev/interfaz_tienda_virtual/src/Components/";
         
//          var header = rutaInterfaz+'/Header.js'
//          var data = fs.readFileSync(header);

//          var text = data.toString();

//          var main = text.split(`<Nav.Link href="/${nombreRuta.toLowerCase()}" >${nombreRuta}</Nav.Link>`)
//          var nuevoText=[]         
//          nuevoText.push(main[0])
//          nuevoText.push('')
//          nuevoText.push(main[1])

//          var text = nuevoText.join('')

//          text.split('\n').filter(item=>item.trim()!=='').join('\n')

//          await programadorServicios.escribir(header,text);

//          var mainRuta = rutaInterfaz+'/Main.js'
//          var data = fs.readFileSync(mainRuta);

//          var text = data.toString();

//          var main = text.split(`<Route path="/${nombreRuta.toLowerCase()}" component={${nombreRuta}} />`)
//          var nuevoText2=[]         
//          nuevoText2.push(main[0])
//          nuevoText2.push('')
//          nuevoText2.push(main[1])

//          var text = nuevoText2.join('')


//          var main1 = text.split(`import ${nombreRuta} from "./${nombreRuta}/index";`)
//          var nuevoText1=[]         
//          nuevoText1.push(main1[0])
//          nuevoText1.push('')
//          nuevoText1.push(main1[1])

//          var text = nuevoText1.join('')
//          console.log(text.split('\n'))

//          var nt = text.split('\n').filter(item=>item.trim()!=='').join('\n')
         
//          console.log(rutaInterfaz+nombreRuta)

//          await programadorServicios.escribir(mainRuta,nt);

//          await programadorServicios.eliminarCarpeta(rutaInterfaz+nombreRuta);

//          /********************fin interfaz*****************/

// 			// /return res.json({"success":true,"data":datos})

// 			var ruta = 'src/router.js';
// 			var data = fs.readFileSync(ruta);

// 			data = data.toString().split('\n');

// 			var array = [
// 				`const ${consulta[0].nombre_recurso} = require("./Controladores/${nombreRuta}/${nombreRuta}.js");`,
// 				`router.get('/api/${consulta[0].nombre_recurso}',${consulta[0].nombre_recurso}.consultar);`,
// 				`router.get('/api/${nombre}/consultar',${consulta[0].nombre_recurso}.consultarId);`,
// 				`router.post('/api/${nombre}/crear',${consulta[0].nombre_recurso}.crear);`,
// 				`router.put('/api/${nombre}/editar',${consulta[0].nombre_recurso}.editar);`,
// 				`router.delete('/api/${nombre}/eliminar',${consulta[0].nombre_recurso}.eliminar);`
// 			]

// 			var rou = await data.filter(function(el) {
// 			  return el.trim().toLowerCase()!=array[0].trim().toLowerCase() 
// 			  && el.trim().toLowerCase()!=array[1].trim().toLowerCase()
// 			  && el.trim().toLowerCase()!=array[2].trim().toLowerCase()
// 			  && el.trim().toLowerCase()!=array[3].trim().toLowerCase()
// 			  && el.trim().toLowerCase()!=array[4].trim().toLowerCase()
// 			  && el.trim().toLowerCase()!=array[5].trim().toLowerCase()
// 		  }).filter(item=>item.trim()!=='');

// 		  data = rou.join('\n')

// 			await programadorServicios.eliminarCarpeta(rutaCarpeta);
// 		   await programadorServicios.escribir(ruta,data);

// 		  var SQL = "delete from recursos where id_recurso=$1";
// 			await db.consultar(con,SQL,[datos.id_recurso]);
// 			await db.consultar(con,`DROP TABLE public.${consulta[0].nombre_recurso};`,[]);
			
// 			return res.json({"success":true,"data":datos})
// 		}catch(e){
// 			return res.json({"success":false,"error":e})
// 		}
// 	}

// }
