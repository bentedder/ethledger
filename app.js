require('es6-promise').polyfill();
require('isomorphic-fetch');
var path = require('path');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
console.log(process.env.MONGODB_URI);
mongoose.connect('mongodb://heroku_hs0fxhwl:go3pgv2ef2sg56865bbdprlpkh@ds053788.mlab.com:53788/heroku_hs0fxhwl');

var Address = mongoose.model('Address', { name: String, address: String });
var Transaction = mongoose.model('Transaction', { 
  blockNumber: String,
  blockHash: String,
  timeStamp: String,
  hash: { type: 'string', unique: true },
  nonce: String,
  transactionIndex: String,
  from: String,
  to: String,
  value: String,
  gas: String,
  gasPrice: String,
  input: String,
  contractAddress: String,
  cumulativeGasUsed: String,
  txreceipt_status: String,
  gasUsed: String,
  confirmations: String,
  isError: String
});

app.use(express.static('build'));
app.use('/static', express.static(__dirname + '/static'));

app.set('view engine', 'pug');
app.use(cors());
app.use('/api', bodyParser.json());

var createAddress = function(req, res) {
  var address = req.body.address;
  var name = req.body.name;
  var existing = Address.where({ address: address });
  existing.findOne(function(err, addr) {
    if (err) {
      res.status(500).send(err.msg);
    }
    if (addr) {
      res.status(500).send('You already have saved that address');
    } else {
      Address.create({ name: name, address: address }, function(err, addr) {
        if (err) {
          res.status(500).send(err.msg);
        } else {
          res.json(addr);
        }
      });
    }
  })
  
};

var deleteAddress = function(req, res) {
  var address = req.params.address;
  console.log(address);
  // method here for removing an address
  Address.deleteOne({ address: address }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).send(err.msg);
    } else {
      res.json({
        deleted: true,
      });
    }
  });
};

var getAllAddresses = function(req, res) {
  Address.find().then(function(addresses) {
    res.json({
      addresses: addresses
    });
  });
};

var getSingleAddress = function(req, res) {
  var address = req.params.address;
  var refresh = req.query.refresh === '1';
  var limit = req.query.limit || 25;
  var page = req.query.page || 1;
  // method here for fetching all data from DB for this address
  // if refresh is true, fetch from source, update DB, and return data
  var weiToEth = 1000000000000000000;
  
  var accountURL = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey' + process.env.ETHERSCAN_API_KEY;
  var account = fetch(accountURL).then(function(res) { return res.json(); }).then(function(res) {
    return res.result / weiToEth;
  });
  
  var transactionURL = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&sort=desc&apikey=' + process.env.ETHERSCAN_API_KEY;
  var transactions = fetch(transactionURL).then(function(res) { return res.json(); }).then(function(res) {
    return res.result;
  });


  Promise.all([account, transactions]).then(function(rs) {
    res.json({
      balance: rs[0],
      transactions: rs[1]
    })
  });
};

var getBalance = function(req, res) {
  var address = req.params.address;
  var weiToEth = 1000000000000000000;
  
  var accountURL = 'https://api.etherscan.io/api?module=account&action=balance&address=' + address + '&tag=latest&apikey' + process.env.ETHERSCAN_API_KEY;
  fetch(accountURL)
    .then(function(res) {
      return res.json();
    })
    .then(function(res) {
      return res.result / weiToEth;
    });
};

var getTransactions = function(req, res) {
  var address = req.params.address;
  Transaction.find().or([{ from: address.toLowerCase() }, { to: address.toLowerCase() }]).exec(function(err, t) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ transactions: t })
    }
  })
}

var updateTransactions = function(req, res) {
  var address = req.params.address;
  var transactionURL = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=' + process.env.ETHERSCAN_API_KEY;
  fetch(transactionURL)
    .then(function(resp) { return resp.json(); })
    .then(function(resp) {
      Transaction.insertMany(resp.result, { ordered: false },  function(err, transactions) {
        if (err) {
          // console.log(err);
          getTransactions(req, res);
          // if (err.result.nInserted > 0) {
          // } else {
          //   res.status(500).send(err.message);
          // }
        } else {
          res.json({ transactions: transactions });
        }
      });
    });

}

app.get('/api/address', getAllAddresses);
app.get('/api/address/:address/balance', getBalance)
app.get('/api/address/:address/transactions/update', updateTransactions)
app.get('/api/address/:address/transactions', getTransactions)
app.get('/api/address/:address', getSingleAddress);
app.delete('/api/address/:address', deleteAddress);
app.post('/api/address', createAddress);

// fallback route
app.get('/*', function(req, res) {
  res.sendFile(path.resolve(__dirname, 'build/index.html'));
});

module.exports = app;