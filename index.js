var app = require('./app');
var debug = require('debug');
var http = require('http');

var port = process.env.PORT || 5000;
app.set('port', port);

var server = http.createServer(app);
server.listen(port, function() {
  console.log('listening on port' + port);
});
