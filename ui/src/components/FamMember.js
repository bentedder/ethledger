import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as moment from 'moment';
import { weiToEth } from '../common';

class FamMember extends Component {

  state = {
    transactions: [],
    fetching: false,
  }

  getTransactions = (address) => {
    this.setState({ fetching: true });
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${address}/transactions`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ transactions: data.transactions.map((transaction) => ({
        ...transaction,
        value: (parseInt(transaction.value, 10) / weiToEth).toPrecision(4),
      })), fetching: false });
    })
    .catch(err => {
      console.error(err.message);
      this.setState({ fetching: false });
    });
  }

  updateTransactions = () => {
    this.setState({ fetching: true });
    fetch(`${process.env.REACT_APP_API_URL}/api/address/${this.props.address}/transactions/update`, {
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(data => {
      this.setState({ transactions: data.transactions.map((transaction) => ({
        ...transaction,
        value: (parseInt(transaction.value, 10) / weiToEth).toPrecision(4),
      })), fetching: false });
    })
    .catch(err => {
      console.error(err.message);
      this.setState({ fetching: false });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      if (!this.state.fetching) {
        this.getTransactions(nextProps.address);
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.fetching &&
          <div>Fetching data...</div>
        }
        {!this.state.fetching &&
          <div>
            {/* balance: {this.state.details.balance}<br/> */}
            Transactions: <button onClick={this.updateTransactions}>Update transactions</button>
            <ul>
              {this.state.transactions && this.state.transactions.map((transaction, i) =>
                <li key={i}>
                  {transaction.to === this.props.address ? 'Received' : 'Sent'} {transaction.value} Ether 
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

export default FamMember;
