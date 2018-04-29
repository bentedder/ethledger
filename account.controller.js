var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();
var weiToEth = 1000000000000000000;

// Create model
var Account = mongoose.model('Account', {
  name: String,
  address: { type: 'string', unique: true },
  balance: Number
});

var updateAccountBalance = function(account, req, res) {
  var url = 'https://api.etherscan.io/api?module=account&action=balance&address=' + account.address + '&tag=latest&apikey=' + process.env.ETHERSCAN_API_KEY;
  fetch(url).then(function(r) { return r.json() }).then(function(data) {
    account.balance = parseInt(data.result, 10) / weiToEth;
    account.save(function(err, updatedAccount) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({
          account: updatedAccount
        });
      }
    });
  });
}

var batchUpdateBalances = function(accounts, req, res, callback) {
  var addressString = accounts.map(function(account) { return account.address; }).join(',');
  var url = 'https://api.etherscan.io/api?module=account&action=balancemulti&address=' + addressString + '&tag=latest&apikey=' + process.env.ETHERSCAN_API_KEY;
  fetch(url).then(function(r) { return r.json() }).then(function(data) {
    var batchUpdates = [];
    data.result.forEach(function(accBal) {
      batchUpdates.push({
        updateOne: {
          filter: { address: accBal.account },
          update: { balance: parseInt(accBal.balance, 10) / weiToEth}
        }
      });
    });
    Account.bulkWrite(batchUpdates).then(function(err, updates) {
      callback();
    });
  });
}

var getAccount = function(req, res) {
  var address = req.params.address;
  Account.findOne({ address: address }, function(err, account) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      if (account) {
        updateAccountBalance(account, req, res);
      } else {
        res.status(500).send('You have requested an address you have not saved yet...');
      }
    }
  })
};

var getAccounts = function(req, res) {
  var address = req.params.address;
  var page = req.query.page || 1;
  var limit = 20; // for batching purposes
  // Need to add pagination and limit here
  Account.find(function(err, accounts) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      if (accounts.length) {
        batchUpdateBalances(accounts, req, res, function() {
          // This is kind of gross. Cleanup later.
          Account.find(function(err, accounts) {
            if (err) {
              res.status(500).send(err.message);
            } else {
              if (accounts.length) {
                res.json({
                  accounts: accounts
                });
              }
            }
          });
        });
      } else {
        res.json({
          accounts: []
        });
      }
    }
  })
};

var createAccount = function(req, res) {
  var address = req.body.address;
  var name = req.body.name;
  var existing = Account.where({ address: address });
  existing.findOne(function(err, addr) {
    if (err) {
      res.status(500).send(err.msg);
    }
    if (addr) {
      res.status(500).send('You already have saved that address');
    } else {
      Account.create({ name: name, address: address }, function(err, account) {
        if (err) {
          res.status(500).send(err.msg);
        } else {
          updateAccountBalance(account, req, res);
        }
      });
    }
  })
}

var deleteAccount = function(req, res) {
  var address = req.params.address;
  Account.deleteOne({ address: address }, function(err) {
    if (err) {
      console.log(err);
      res.status(500).send(err.msg);
    } else {
      // Cleanup step required here to destroy all transactions related to this address
      res.json({
        deleted: true,
      });
    }
  });
};

router.get('/', getAccounts);
router.delete('/:address', deleteAccount);
router.post('/', createAccount);
router.get('/:address', getAccount);

module.exports = router;