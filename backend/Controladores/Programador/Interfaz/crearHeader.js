
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");
const fs = require('fs');

module.exports = (ruta,nombre)=>{
   try{
      ruta = ruta+'/Header.js'
      var data = fs.readFileSync(ruta);

      var text = data.toString();

      var header = `<Nav.Link href="/${nombre.toLowerCase()}" >${nombre}</Nav.Link>`

      var nuevoText = []

      var main = text.split('{/*aqui*/}')

      nuevoText.push(main[0]);
      nuevoText.push(header);
      nuevoText.push('\n{/*aqui*/}');
      nuevoText.push(main[1]);

      var text = nuevoText.join('')
      console.log(text)

      return programadorServicios.escribir(ruta,text);

   }catch(e){
      throw util.crearError ('IR001',e);
   }
}