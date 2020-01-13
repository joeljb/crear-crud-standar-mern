// require("@babel/register")({
//    "presets": ["@babel/preset-env"]
// });

// require("babel-core").transform("code", {
//    presets: ["es2015"]
// });

//importamos optimist para ver lo orgumento y leer si vamos  a estar en produccion o desarrollo
var argv = require('optimist').argv;

console.log(argv)

if (argv.env == 'prod') {
   console.log("Aqui")
   module.exports = require('./dist-backend/server.js')
} else {
   module.exports = require('./backend/server.js')
}
