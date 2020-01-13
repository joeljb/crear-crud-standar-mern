
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");
const fs = require('fs');

module.exports = (ruta, nombre) => {
   try {
      ruta = ruta + '/Main.js';
      var data = fs.readFileSync(ruta);

      var text = data.toString();

      var importar = `import ${nombre} from "./${nombre}/index";`;
      var route = `      <Route path="/${nombre.toLowerCase()}" component={${nombre}} />`;

      var nuevoText = [];
      var nuevoRoute = [];

      var valor1 = text.split('\n');
      var f = valor1.filter(item => item == route).length > 0;
      var f1 = valor1.filter(item => item == importar).length > 0;

      if (f || f1) {
         throw util.crearError('IR002', "ERROR AL AGREGAR EL ROUTE YA EXISTE");
      }

      var main = text.split('const Main = () => (');

      nuevoText.push(main[0]);
      nuevoText.push(importar);
      nuevoText.push('\nconst Main = () => (');

      var valor = main[1].split('</Switch>');

      nuevoRoute.push(valor[0]);
      nuevoRoute.push(route);
      nuevoRoute.push('\n</Switch>');
      nuevoRoute.push(valor[1]);

      nuevoText.push(nuevoRoute.join(''));

      var text = nuevoText.join('');
      console.log(text);

      return programadorServicios.escribir(ruta, text);
   } catch (e) {
      throw util.crearError('IR001', e);
   }
};