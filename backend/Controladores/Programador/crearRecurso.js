
var util = require('../../Servicios/utils.js');

var programadorServicios = require("./ProgramadorServicios.js");
var traerInfo = require("./traerInfo.js");
var crearSql = require("./crearSql.js");

module.exports = async (con,datos,rutaArchivo,nombreRuta,rutaArchivoModelo)=>{
	try{

		var campos = datos.campos;

		if(datos.nombre_recurso.slice(-2)=='es'){
			var id = 'id_'+datos.nombre_recurso.slice(0,-2);
			var nombre = datos.nombre_recurso.slice(0,-2);
		}else if(datos.nombre_recurso.slice(-1)=='s'){
			var id = 'id_'+datos.nombre_recurso.slice(0,-1);
			var nombre = datos.nombre_recurso.slice(0,-1);
      }else{
         var id = 'id_'+datos.nombre_recurso;
         var nombre = datos.nombre_recurso;
		}

		var consultar = await traerInfo.consultar(datos);
		var consultarId = await traerInfo.consultarId(datos,id);
		var crear = await traerInfo.crear(datos,campos,nombreRuta);
		var editar = await traerInfo.editar(datos,id,campos,nombreRuta);
		var eliminar = await traerInfo.eliminar(datos,id);

		texto = `
const db = require('../../servicios/db.js');
const ValidarCampos = require('../../servicios/ValidarCampos.js');

module.exports = {
${consultar}
${consultarId}
${crear}
${editar}
${eliminar}
}`;
		await programadorServicios.crearArchivo(rutaArchivo,texto);
		await programadorServicios.crearRouter(datos,nombreRuta,nombre);
		await programadorServicios.crearModelo(datos,rutaArchivoModelo,campos);
		await crearSql(con,datos,id,campos);
	
		return true;

	}catch(e){
      console.log(e)
		throw util.crearError ('CRE001',e);
	}
}

