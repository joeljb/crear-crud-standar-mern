
const fs = require('fs');
const q = require('q');
const db = require('../../Servicios/db.js');
const Error = require('../../Servicios/utils.js');
const util = require('../../Servicios/utils.js')
const path = require('path');

	exports.crearRouter= async (datos,nombreRuta,nombre)=>{
		try	{
			var ruta = 'src/router.js';
			var data = fs.readFileSync(ruta);

			data = data.toString().split('\n');
			var final = data.find((item)=>{
				return item=='module.exports = router;'
			});

		var nueva_ruta = `
const ${datos.nombre_recurso} = require("./Controladores/${nombreRuta}/${nombreRuta}.js");
		router.get('/api/${datos.nombre_recurso}',${datos.nombre_recurso}.consultar);
		router.get('/api/${nombre}/consultar',${datos.nombre_recurso}.consultarId);
		router.post('/api/${nombre}/crear',${datos.nombre_recurso}.crear);
		router.put('/api/${nombre}/editar',${datos.nombre_recurso}.editar);
		router.delete('/api/${nombre}/eliminar',${datos.nombre_recurso}.eliminar);
${final}
`;
			var data = data.filter((item)=>{
				return item!='module.exports = router;'
			});

			data = data.join('\n');

			this.escribir(ruta,data);

			fs.appendFileSync (ruta,nueva_ruta);

		}catch(e){
			throw util.crearError ('CRO001',e);
		}
	},

	exports.agregarFile= function(ruta,texto){
		try	{
			return fs.appendFileSync (ruta,texto);
		}catch(e){
			throw util.crearError ('AF001',e);
		}
	}

	exports.escribir=(ruta,texto)=>{
		try	{
			return fs.writeFileSync(ruta,texto);
		}catch(e){
			throw util.crearError ('ES001',e);
		}
	}

	exports.crearArchivo= (ruta,texto)=>{
		var deferred = q.defer();
		var stream = fs.createWriteStream(ruta);
		stream.once('open', (fd) => {
	      stream.write(texto);
	      stream.write('\n');
	      stream.end();
			deferred.resolve();
		}).on('error', function (err) {
	      deferred.reject(err);
	   }).on('finish', function () {
	      deferred.resolve();
	   });
		return deferred.promise;
	}

exports.crearModelo = async (datos,rutaArchivoModelo,campos)=>{
		try{

			var attr = ''
			campos.map((item)=>{
			var att = ''
				var nombre = item.value
				var atributos = item.atributos
				for(var obj in atributos){
					att = att+`${obj}:${JSON.stringify(atributos[obj])},
			`
				}
				attr = attr+`		
		${nombre}:{
			${att}
		},`
			})

 			var texto = `module.exports = {
 	atributos:{
		${attr}
	}
}`
		return this.crearArchivo(rutaArchivoModelo,texto)

		}catch(e){
			throw util.crearError ('CM001',e);
		}
	}

exports.eliminarCarpeta = async (rutaCarpeta)=>{
	try{
		if (fs.existsSync(rutaCarpeta)) {
			await fs.readdirSync(rutaCarpeta).forEach(function(archivo) {
        var archivo_path = path.join(rutaCarpeta, archivo);
        if (fs.lstatSync(archivo_path).isDirectory()) {
          this.eliminarCarpeta(archivo_path);
        } else {
          fs.unlinkSync(archivo_path);
        }
      });
			await fs.rmdirSync(rutaCarpeta);
		}

		return true;

	}catch(e){
		throw util.crearError ('ELC001',e);
	}
}
