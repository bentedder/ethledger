var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

// Create model
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

var getFromDB = function(req, res) {
  var address = req.params.address;
  var direction = req.query.direction || 'both';
  var query = Transaction.find();
  if (direction === 'both') {
    query.or([{ from: address.toLowerCase() }, { to: address.toLowerCase() }]);
  } else if (direction === 'inbound') {
    query.where({ to: address.toLowerCase() });
  } else if (direction === 'outbound') {
    query.where({ from: address.toLowerCase() });
  }
  query.exec(function(err, t) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ transactions: t })
    }
  });
}

var updateTransactions = function(req, res) {
  var address = req.params.address;
  var transactionURL = 'http://api.etherscan.io/api?module=account&action=txlist&address=' + address + '&page=1&offset=1000&startblock=0&endblock=99999999&sort=desc&apikey=' + process.env.ETHERSCAN_API_KEY;
  fetch(transactionURL)
    .then(function(resp) { return resp.json(); })
    .then(function(resp) {
      Transaction.insertMany(resp.result, { ordered: false },  function(err, transactions) {
        getFromDB(req, res);
      });
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
}

var getTransactions = function(req, res) {
  var refresh = req.query.refresh === '1';
  if (refresh) {
    updateTransactions(req, res);
  } else {
    getFromDB(req, res);
  }
}

router.get('/:address', getTransactions);

module.exports = router;