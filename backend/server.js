//server/server.js

import express from 'express'
var router = require('./router.js')
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../dist'));
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/', router);

console.log("hol")
var port = 8000
app.listen(port, function () {
   console.log('running at localhost: ' + port);
});