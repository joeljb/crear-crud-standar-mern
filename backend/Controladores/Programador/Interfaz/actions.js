
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");

module.exports = (ruta,nombre,datos,id)=>{

   console.log(ruta)
   try{

      var texto = `

import {
   DATA,
   DATA_SUCCESS,
   DATA_ERROR,
   ELIMINANDO,
   DATA_ELIMINADO,
   DATA_ELIMINADO_ERROR,
   REGISTRAR_SUCCESS,
   REGISTRAR_ERROR
} from './actionTypes'

import api from '../../Api'

export const traer${nombre} = (dispatch,url,metodo)=>{

   dispatch({type:DATA});
   api(url,metodo).then(([response,json])=>{
      if (json.success) {
         dispatch({
            type:DATA_SUCCESS,
            data:json.data
         })
      }else{
         dispatch({
            type:DATA_ERROR,
            error:json.error
         })
      }
   },error=>{
      dispatch({
         type:DATA_ERROR,
         error
      })
   })
}
export const registrar${nombre} = (url,metodo,data)=>{
   return new Promise((r,j)=>{
      api(url,metodo,data).then(([response,json])=>{
         if (json.success) {
            r({
               type:REGISTRAR_SUCCESS,
               data:json.data
            })
         }else{
            j({
               type:REGISTRAR_ERROR,
               error:json.error
            })
         }
      },error=>{
         j({
            type:REGISTRAR_ERROR,
            error
         })
      })
   })
}

export const eliminar${nombre} = (dispatch,url,metodo,data)=>{

   dispatch({type:ELIMINANDO});
   api(url,metodo,data).then(([response,json])=>{
      console.log(json)
      if (json.success) {
         dispatch({
            type:DATA_ELIMINADO,
            id:data.${id}
         })
      }else{
         dispatch({
            type:DATA_ELIMINADO_ERROR,
            error:json.error
         })
      }
   },error=>{
      console.log(error)
      dispatch({
         type:DATA_ELIMINADO_ERROR,
         error
      })
   })
}
      `
      return programadorServicios.crearArchivo(ruta,texto);

   }catch(e){
      throw util.crearError ('IA001',e);
   }
}