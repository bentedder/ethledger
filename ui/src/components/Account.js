import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router-dom';
import * as moment from 'moment';
import { weiToEth } from '../common';
import { bindActionCreators } from 'redux';
import { getAccount, getTransactions } from '../state/actions';

class Account extends Component {

  state = {
    filters: {
      direction: 'both',
      sort: 'asc',
    }
  }

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

  getTransactions = (refresh = false) => {
    this.props.getTransactions(this.props.match.params.address, refresh, this.state.filters);
  }

  handleChange = (e) => {
    this.setState({ filters: {
      ...this.state.filters,
      direction: e.target.value,
    }}, () => {
      this.getTransactions();
    });
  }

  render() {
    return (
      <div>
        {this.props.account &&
          <div>
            <h2>{this.props.account.name}</h2>
            <p>{this.props.account.address}</p>
            {this.props.account.balance} ETH<br/>
            Transactions: <button onClick={this.getTransactions.bind(null, true)}>Update transactions</button>
            <label>Both <input type="radio" value="both" onChange={this.handleChange} checked={this.state.filters.direction === 'both'} /></label>
            <label>Received <input type="radio" value="inbound" onChange={this.handleChange} checked={this.state.filters.direction === 'inbound'} /></label>
            <label>Sent <input type="radio" value="outbound" onChange={this.handleChange} checked={this.state.filters.direction === 'outbound'} /></label>
            <ul>
              {this.props.transactions.map((transaction, i) =>
                <li key={i}>
                  {transaction.to.toLowerCase() === this.props.match.params.address.toLowerCase() ? 'Received' : 'Sent'} {(transaction.value / weiToEth).toPrecision(4)} Ether 
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