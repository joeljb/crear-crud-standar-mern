
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");

module.exports = ruta => {
   try {
      var texto = `
export const DATA = 'data';
export const DATA_SUCCESS = 'data_success';
export const DATA_ERROR = 'data_error';
export const FILTRAR = 'filtrar';
export const ELIMINANDO = 'eliminando';
export const DATA_ELIMINADO = 'data_eliminado';
export const DATA_ELIMINADO_ERROR = 'data_eliminado_error';
export const REGISTRANDO = 'registrando';
export const REGISTRAR_SUCCESS = 'registrar_success';
export const REGISTRAR_ERROR = 'registrar_error';
      `;

      return programadorServicios.crearArchivo(ruta, texto);
   } catch (e) {
      throw util.crearError('IAT001', e);
   }
};