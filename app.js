var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('dist/build'));
app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'pug');
app.use(cors());


app.use('/api', bodyParser.json());

app.post('/api/address', function(req, res) {
  var address = req.body.address;
  var name = req.body.name;
  // method here for creating a new record for address
  res.json({
    address: address,
    name: name
  });
});

app.delete('/api/address/:address', function(req, res) {
  var address = req.params.address;
  // method here for removing an address
  res.json({
    status: 'deleting' + address
  });
});

app.get('/api/address/:address', function(req, res) {
  var address = req.params.address;
  var refresh = req.query.refresh === '1';
  // method here for fetching all data from DB for this address
  // if refresh is true, fetch from source, update DB, and return new
  res.json({
    data: 'data for ' + address,
    refresh: refresh
  });
});

// fallback route
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

module.exports = app;