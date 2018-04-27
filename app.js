require('es6-promise').polyfill();
require('isomorphic-fetch');
var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_hs0fxhwl:go3pgv2ef2sg56865bbdprlpkh@ds053788.mlab.com:53788/heroku_hs0fxhwl');

var accountController = require('./account.controller');
var transactionController = require('./transaction.controller');

app.use(express.static('build'));
app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'pug');
app.use(cors());
app.use('/api', bodyParser.json());

app.use('/api/transactions', transactionController);
app.use('/api/address', accountController);

// fallback route
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

module.exports = app;