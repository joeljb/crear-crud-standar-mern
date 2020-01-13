var util = require('../../Servicios/utils.js');

module.exports = {
	consultar: async (datos)=>{
		try	{
			var texto = `	consultar: async (req, res) =>{
		try{
			var con = req.app.settings.con
			var consulta = await db.consultar(con,"select * from ${datos.nombre_recurso}",[]);

			return res.json({success:true,data:consulta.rows})
		}catch(e){
			return res.json({success:false,error:e})
		}
	},`;
		return texto;

		}catch(e){
			throw util.crearError ('COS001',e);
		}
	},
	consultarId: async (datos,id)=>{
		try	{
			var texto = `	consultarId: async (req, res) =>{
		try{
			var con = req.app.settings.con
			var consulta = await db.consultar(con,"select * from ${datos.nombre_recurso} where ${id}=$1",[req.query.${id}]);

			return res.json({success:true,data:consulta.rows})
		}catch(e){
			return res.json({success:false,error:e})
		}
	},`;
			return texto;

		}catch(e){
			throw util.crearError ('CSI001',e);
		}
	},
	crear: async (datos,campos,nombreRuta)=>{
		try	{
			campos = campos.filter(el=>{
				return el.atributos.tipo!='serial'
			})

			var ca = campos.map(item=>{
				return item.value;
			});
			
			var c = 0;
			var ca1 = campos.map((item,i)=>{
					c++;
					return "$"+c;				
			});

			var ca2 = campos.map(item=>{
					return 'datos.'+item.value;
			});

			var texto = `	crear: async (req, res) =>{
		try{
			var datos = req.body;
			var con = req.app.settings.con;
			await ValidarCampos(datos,'${nombreRuta}');
			let SQL = "insert into ${datos.nombre_recurso} (${ca}) values (${ca1})"
			var consulta = await db.insertar(con,SQL,[${ca2}]);

			return res.json({success:true,data:consulta});
		}catch(e){
			return res.json({success:false,error:e});
		}
	},`;
			return texto;

		}catch(e){
			throw util.crearError ('CRE001',e);
		}
	},
	editar: async (datos,id,campos,nombreRuta)=>{
		try	{
			campos = campos.filter(el=>{
				return el.atributos.tipo!='serial'
			})
			var ca = campos.map((item,i)=>{
				var c = i+3;
				return item.value+"=$"+c;
			});

			var ca1 = campos.map(item=>{
				return 'datos.'+item.value;
			});

			var texto = `	editar: async (req, res) =>{
		try{
			var con = req.app.settings.con;
			var datos = req.body;
			await ValidarCampos(datos,'${nombreRuta}');
			let SQL = "update ${datos.nombre_recurso} set fecha_actualizacion=$2, ${ca}  where ${id}=$1"
			var consulta = await db.consultar(con,SQL,[datos.${id},'now()',${ca1}]);

			return res.json({success:true,data:consulta.rows});
		}catch(e){
			return res.json({success:false,error:e});
		}
	},
		`;
			return texto;

		}catch(e){
			throw util.crearError ('ED001',e);
		}
	},
	eliminar: async (datos,id)=>{
		try	{
			var texto = `	eliminar: async (req, res) =>{
		try{
			var con = req.app.settings.con;
			var datos = req.body;
		
			let SQL = "delete from  ${datos.nombre_recurso} where ${id}=$1"
			var consulta = await db.consultar(con,SQL,[datos.${id}]);

			return res.json({success:true,data:consulta.rows});
		}catch(e){
			return res.json({success:false,error:e});
		}
	}`;
			return texto;

		}catch(e){
			var err = 'ERROR AL consultar: '+e;
			throw err;
		}
	}
}