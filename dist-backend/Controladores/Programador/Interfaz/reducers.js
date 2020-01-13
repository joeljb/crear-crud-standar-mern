
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");

module.exports = (ruta, nombreReducers, datos, id) => {

   console.log(ruta);
   try {
      var camposFiltrar = datos.campos.map(item => {

         if (item.atributos.tipo == 'integer' || item.atributos.tipo == 'integer') {
            return `l.${item.value}.toString().toLowerCase().indexOf(action.value.toLowerCase())>-1`;
         }
         return `l.${item.value}.toLowerCase().indexOf(action.value.toLowerCase())>-1`;
      }).join(" || ");

      var texto = `
import {
   DATA,
   DATA_SUCCESS,
   DATA_ERROR,
   FILTRAR,
   ELIMINANDO,
   DATA_ELIMINADO,
   DATA_ELIMINADO_ERROR,
   REGISTRANDO,
   REGISTRAR_SUCCESS,
   REGISTRAR_ERROR
} from './actionTypes'

const ${nombreReducers} = (state,action)=>{
   switch (action.type){
      case DATA:
         return {
            ...state,
            data:[],
            datos:[],
            buscando:true,
            error:''
         }
      case DATA_SUCCESS:
         return {
            ...state,
            data:action.data,
            datos:action.data,
            buscando:false,
            error:''
         }
      case DATA_ERROR:
         return {
            ...state,
            data:[],
            datos:[],
            buscando:false,
            error:action.error
         }
      case FILTRAR:
         return {
            ...state,
            datos:state.data.filter(l=>{
               return ${camposFiltrar}
            })
         }
         case ELIMINANDO:
            return {
               ...state,
               eliminando:true,
               errorEliminar:''
            }
         case DATA_ELIMINADO:
            return {
               ...state,
               eliminando:false,
               errorEliminar:'',
               datos:state.data.filter(l=>{
                  return l.${id}!==action.id; 
               }),
               data:state.data.filter(l=>{
                  return l.${id}!==action.id;
               })
            }
         case DATA_ELIMINADO_ERROR:
            return {
               ...state,
               eliminando:false,
               errorEliminar:action.error
            }
      default:
         return{
            ...state
         }
   }
}

export default ${nombreReducers};
      `;

      console.log(texto);

      return programadorServicios.crearArchivo(ruta, texto);
   } catch (e) {
      throw util.crearError('IR001', e);
   }
};