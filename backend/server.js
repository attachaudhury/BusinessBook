var http = require('http');
var app = require('./app')
app.set('port',8008);

const server = http.createServer(app)
console.log('listening on port 8008')
server.listen(8008)