
const db = require('../../Servicios/db.js');

const util = require('../../Servicios/utils.js');
const validarCampos = require('../../Servicios/ValidarCampos.js');

var defaultReglas = require(`../../Servicios/reglas.js`);
var defaultMensajes = require(`../../Servicios/mensajes.js`);

const fs = require('fs');

module.exports = async (con, datos, rutaArchivo, rutaArchivoModelo, nombreRuta) => {
	try {

		datos.campos.map(item => {
			item.atributos.tipo = item.atributos.tipo || 'string';
			if (!defaultReglas.tipo(item.atributos.tipo)) {
				throw util.crearError("VR006", `el atributo tipo es "${item.atributos.tipo}" y tiene que ser uno de estos \n["string","date","dateTimeZone","json","numeric","integer","serial","time","boolean"];`);
			}

			if (item.atributos.max) {
				if (!defaultReglas.entero.test(item.atributos.max)) {
					throw util.crearError("VR007", `el atributo max es "${item.atributos.max}" y tiene que ser un numero entero mayor a 0`);
				}
			}
			if (item.atributos.min) {
				if (!defaultReglas.entero.test(item.atributos.min)) {
					throw util.crearError("VR008", `el atributo min es "${item.atributos.min}" y tiene que ser un numero entero mayor a 0`);
				}
			}
			if (item.atributos.min && item.atributos.max) {
				console.log(item.atributos.min);
				console.log(item.atributos.max);
				if (parseInt(item.atributos.min) > parseInt(item.atributos.max)) {
					throw util.crearError("VR009", `el atributo min es "${item.atributos.min}" y es mayor que el max: ${item.atributos.max}`);
				}
			}
			if (item.atributos.digito) {
				if (!defaultReglas.entero.test(item.atributos.digito)) {
					throw util.crearError("VR010", `el atributo digito es "${item.atributos.digito}" y tiene que se un numero entero`);
				}
			}
			if (item.atributos.decimal) {
				if (!defaultReglas.entero.test(item.atributos.decimal)) {
					throw util.crearError("VR011", `el atributo decimal es "${item.atributos.decimal}" y tiene que se un numero entero`);
				}
			}
		});
		let sql_consulta = "select * from recursos where nombre_recurso=$1";
		//verificar si ya hay un registro con ese nombre_recurso en la base de datos
		var consulta = await db.consultar(con, sql_consulta, [datos.nombre_recurso]);

		if (consulta.length > 0) {
			let error = "Ya existe un recurso con el nombre: " + datos.nombre_recurso;
			throw util.crearError("VR002", error);
		}

		//verificar si en el router hay un llamado
		var ruta = 'src/router.js';
		var data = fs.readFileSync(ruta);

		data = data.toString().split('\n');

		if (datos.nombre_recurso.slice(-2) == 'es') {
			var nombre = datos.nombre_recurso.slice(0, -2);
		} else {
			var nombre = datos.nombre_recurso.slice(0, -1);
		}

		var array = [`const ${datos.nombre_recurso} = require("./Controladores/${nombreRuta}/${nombreRuta}.js");`, `router.get('/api/${datos.nombre_recurso}',${datos.nombre_recurso}.consultarId);`, `router.get('/api/${nombre}/consultar',${datos.nombre_recurso}.consultar);`, `router.post('/api/${nombre}/crear',${datos.nombre_recurso}.crear);`, `router.put('/api/${nombre}/editar',${datos.nombre_recurso}.editar);`, `router.delete('/api/${nombre}/eliminar',${datos.nombre_recurso}.eliminar);`];
		var rou = data.filter(function (el) {
			for (var i = array.length - 1; i >= 0; i--) {
				return el.toLowerCase().indexOf(array[i].toLowerCase()) > -1;
			}
		});

		if (rou.length > 0) {
			let error = "Ya existen estas rutas: " + rou;
			throw util.crearError("VR003", error);
		}

		//verificar si existe archivo
		if (fs.existsSync(rutaArchivo)) {
			let error = "Ya existe un archivo con ese nombre: " + rutaArchivo;
			throw util.crearError("VR004", error);
		}

		//verificar si existe archivo
		if (fs.existsSync(rutaArchivoModelo)) {
			let error = "Ya existe un archivo con ese nombre: " + rutaArchivoModelo;
			throw util.crearError("VR005", error);
		}

		return true;
	} catch (error) {
		console.log(error);
		throw error;
	}
};