import * as moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { base, weiToEth } from '../common';
import { getTransactions } from '../state/actions';

class Transactions extends Component {

  state = {
    filters: {
      direction: 'both',
      sort: 'asc',
    }
  }

  componentDidMount() {
    this.getTransactions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.getTransactions();
    }
  }

  getTransactions = (refresh = false) => {
    this.props.getTransactions(this.props.address, refresh, this.state.filters);
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
      <Wrap>
        <div className="list-header">
          <div className="title">
            <span>Transactions:</span>
            <button className="hard-refresh" onClick={this.getTransactions.bind(null, true)}>Refresh</button>
          </div>
          <div className="filters">
            <label className={this.state.filters.direction === 'both' ? 'active' : ''}>Both <input type="radio" value="both" onChange={this.handleChange} checked={this.state.filters.direction === 'both'} /></label>
            <label className={this.state.filters.direction === 'inbound' ? 'active' : ''}>Received <input type="radio" value="inbound" onChange={this.handleChange} checked={this.state.filters.direction === 'inbound'} /></label>
            <label className={this.state.filters.direction === 'outbound' ? 'active' : ''}>Sent <input type="radio" value="outbound" onChange={this.handleChange} checked={this.state.filters.direction === 'outbound'} /></label>
          </div>
        </div>
        <div className="list">
          {this.props.loading &&
            <div>Loading transactions. Note: if this is a very active account, the request may time out.</div>
          }
          {!this.props.loading && this.props.transactions.length === 0 &&
            <div>No transactions match your query.</div>
          }
          <ul class="transaction-list">
            {this.props.transactions.map((transaction, i) =>
              <li key={i}>
                <div className="direction">{transaction.to.toLowerCase() === this.props.match.params.address.toLowerCase() ? 'Received' : 'Sent'}</div>
                <div className="value">{(transaction.value / weiToEth).toPrecision(4)} Ether</div>
                <div className="timestamp">{moment(transaction.timeStamp * 1000).format('MMM DD, YYYY hh:mma')}</div>
              </li>
            )}
          </ul>
        </div>
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  background: #fff;
  padding: ${base * 2}px;
  max-width: 600px;
  margin: 0 auto;

  .list-header {
    border-bottom: 1px solid #ccc;
    margin-bottom: ${base * 2}px;
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      display: flex;
      justify-content: space-around;
    }

    .filters {
      flex: 1;
      text-align: right;
      padding: ${base * 3}px;
      
      label {
        padding: ${base}px;
        border-bottom: 1px solid transparent;
        cursor: pointer;

        &.active {
          color: #005baa;
          border-color: #005baa;
          
        }
      }
      input {
        display: none;
      }
    }

    .hard-refresh {
      background: #efefef;
      color: #333;
      border-radius: 3px;
      outline: none;
      border: 0;
      cursor: pointer;

      &:hover {
        background: #ccc;
      }
    }
  }

  .transaction-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      padding: ${base * 2}px;
      border-bottom: 1px solid #efefef;
    }
  }

  .direction {
    flex: 0 0 100px;
    margin-right: ${base * 2}px;
  }
  .value {
    flex: 0 0 200px;
    margin-right: ${base * 2}px;
  }
`;

const mapStateToProps = (state) => ({
  loading: state.accounts.loadingTransactions,
  transactions: state.accounts.transactions,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getTransactions,
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Transactions))