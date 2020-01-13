
const util = require('../../../Servicios/utils.js');
const fs = require('fs');

const crearActionTypes = require("./actionTypes");
const crearReducers = require("./reducers");
const crearActions = require("./actions");
const crearIndex = require("./crearIndex");
const crearRoute = require("./crearRoute");
const crearHeader = require("./crearHeader");

module.exports = async datos => {
   try {

      var campos = datos.campos;

      if (datos.nombre_recurso.slice(-2) == 'es') {
         var id = 'id_' + datos.nombre_recurso.slice(0, -2);
         var nombreCarpeta = datos.nombre_recurso.slice(0, -2);
      } else if (datos.nombre_recurso.slice(-1) == 's') {
         var id = 'id_' + datos.nombre_recurso.slice(0, -1);
         var nombreCarpeta = datos.nombre_recurso.slice(0, -1);
      } else {
         var id = 'id_' + datos.nombre_recurso;
         var nombreCarpeta = datos.nombre_recurso;
      }

      nombreArch = datos.nombre_recurso.slice(0, 1).toUpperCase() + datos.nombre_recurso.slice(1).toLowerCase();
      nombreArchivo = nombreCarpeta.slice(0, 1).toUpperCase() + nombreCarpeta.slice(1).toLowerCase();
      nombreCarp = nombreCarpeta.slice(0, 1).toUpperCase() + nombreCarpeta.slice(1).toLowerCase() + '/';
      nombreReducers = "reducer" + datos.nombre_recurso.slice(0, 1).toUpperCase() + datos.nombre_recurso.slice(1).toLowerCase();

      console.log(nombreReducers);
      var rutaInterfaz = "/home/joeljb/dev/interfaz_tienda_virtual/src/Components/";
      nombreCarp = rutaInterfaz + nombreArch;

      if (!fs.existsSync(nombreCarp)) {
         fs.mkdirSync(nombreCarp);
      }

      var actionsTypes = nombreCarp + '/actionTypes.js';
      var actions = nombreCarp + '/actions.js';
      var reducers = nombreCarp + '/reducers.js';
      var index = nombreCarp + '/index.js';

      if (fs.existsSync(actionsTypes)) {
         let error = "Ya existe un archivo con ese nombre: " + actionsTypes;
         throw util.crearError("VR004", error);
      }
      if (fs.existsSync(actions)) {
         let error = "Ya existe un archivo con ese nombre: " + actions;
         throw util.crearError("VR004", error);
      }
      if (fs.existsSync(reducers)) {
         let error = "Ya existe un archivo con ese nombre: " + reducers;
         throw util.crearError("VR004", error);
      }
      if (fs.existsSync(index)) {
         let error = "Ya existe un archivo con ese nombre: " + index;
         throw util.crearError("VR004", error);
      }

      await crearActionTypes(actionsTypes);
      await crearReducers(reducers, nombreReducers, datos, id);
      await crearActions(actions, nombreArchivo, datos, id);
      await crearIndex(index, nombreArchivo, datos, id, nombreReducers, nombreArch, nombreCarpeta);
      await crearRoute(rutaInterfaz, nombreArch);
      await crearHeader(rutaInterfaz, nombreArch);

      return true;
   } catch (e) {
      console.log(e);
      throw util.crearError('CRE001', e);
   }
};