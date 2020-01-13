"use strict";

require("@babel/register")({
  presets: ["@babel/preset-env"]
}); //importamos optimist para ver lo orgumento y leer si vamos  a estar en produccion o desarrollo


var argv = require('optimist').argv;

console.log(argv);

if (argv.env == 'prod') {
  module.exports = require('./dist/server.js');
} else {
  module.exports = require('./backend/server.js');
}
