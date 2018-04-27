import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import { weiToEth } from '../common';
import { bindActionCreators } from 'redux';
import { getAccount, getTransactions } from '../state/actions'

class Account extends Component {

  componentDidMount() {
    this.props.getAccount(this.props.match.params.address)
    this.getTransactions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getAccount(this.props.match.params.address);
      this.getTransactions();
    }
  }

  getTransactions = () => {
    this.props.getTransactions(this.props.match.params.address);
  }

  render() {
    return (
      <div>
        {this.props.account &&
          <div>
            <h2>{this.props.account.name}</h2>
            <p>{this.props.account.address}</p>
            {this.props.account.balance} ETH<br/>
            Transactions: <button onClick={this.getTransactions}>Update transactions</button>
            <ul>
              {this.props.transactions.map((transaction, i) =>
                <li key={i}>
                  {transaction.to === this.props.match.params.address ? 'Received' : 'Sent'} {transaction.value} Ether 
                  {moment(transaction.timeStamp * 1000).format('YYYY-MM-DD hh:mma Z')}
                </li>
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  account: state.accounts.activeAccount,
  loading: state.accounts.loadingTransactions,
  transactions: state.accounts.transactions,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccount,
    getTransactions,
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Account))