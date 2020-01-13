
const db = require('../../Servicios/db.js');
var util = require('../../Servicios/utils.js');
module.exports = async (con,datos,id,campos)=>{
	try	{
		var camposSql='';
		var constraint='';
      var constraintO='';
		var check='';

      console.log()

		for (obj  in campos){
			let tipo = campos[obj].atributos.tipo
			let max = campos[obj].atributos.max
			let digito = campos[obj].atributos.digito || 20
			let decimal = campos[obj].atributos.decimal || 2
			let requerido = campos[obj].atributos.requerido?'NOT NULL':''
			let defecto = campos[obj].atributos.defecto?`DEFAULT '${campos[obj].atributos.defecto}'`:''
			let unico = campos[obj].atributos.unico
         console.log("unico")
         console.log(unico)
         console.log("unico")

			let opciones = campos[obj].atributos.opciones
			var tipo_dato=tipo;

			if (tipo=='character' || tipo=='character varying' && parseInt(max)>0) {
				tipo_dato=`${tipo}(${max || 255})`;
			}else if(tipo=='numeric' && parseInt(digito)>0 && parseInt(decimal)>0){
            tipo_dato=`numeric(${digito},${decimal})`;
         }
			camposSql = camposSql+`"${campos[obj].value}" ${tipo_dato} ${requerido} ${defecto},\n`
			console.log("unico")
         console.log(unico)
         console.log("unico")
         if (unico) {
				constraint = constraint + `CONSTRAINT uk_${datos.nombre_recurso}_${campos[obj].value} UNIQUE ("${campos[obj].value}"),\n`
			}
         console.log("unico")
         console.log(unico)
         console.log("unico")
			if (opciones) {
				var opc = opciones.split(';').map(item =>{return `'${item}'::character varying::text`})

				constraintO = constraintO+`CONSTRAINT ck_${datos.nombre_recurso}_${campos[obj].value} CHECK ("${campos[obj].value}" = ANY (ARRAY[${opc}])),\n`
			}
		}
		
		let sql_crear_recurso = `
			CREATE TABLE public.${datos.nombre_recurso}
			(
			  ${id} serial,
			  			${camposSql}
			  fecha_registro timestamp with time zone DEFAULT now(),
			  fecha_actualizacion timestamp with time zone DEFAULT now(),
			  ${constraint}
           ${constraintO}
			  CONSTRAINT ${datos.nombre_recurso}_pkey PRIMARY KEY (${id})
			)
			WITH (
			  OIDS=FALSE
			);
			ALTER TABLE public.${datos.nombre_recurso}
			  OWNER TO postgres;
			`;
         console.log(sql_crear_recurso)
			return db.consultarAll(con,sql_crear_recurso,[]);
	}catch(e){
      console.log(e)
		throw util.crearError ('CS001',e);
	}
}
