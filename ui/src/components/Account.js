import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';

import { base } from '../common';
import { deactivateAccount, getAccount } from '../state/actions';
import Transactions from './Transactions';

class Account extends Component {

  componentDidMount() {
    this.props.getAccount(this.props.match.params.address)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.getAccount(this.props.match.params.address);
    }
  }

  componentWillUnmount() {
    this.props.deactivateAccount();
  }

  render() {
    return (
      <Wrap>
        <Link className="back" to={'/'}>&larr; back to accounts</Link>
        {this.props.loading &&
          <div>Loading account info</div>
        }
        {!this.props.loading && this.props.account &&
          <div>
            <div className="account-header">
              <div className="name">
                <h2>{this.props.account.name}</h2>
                <p className="meta">{this.props.account.address}</p>
              </div>
              <div className="balance">
                {parseFloat(this.props.account.balance).toFixed(4)} ETH
              </div>
            </div>
            <Transactions address={this.props.account.address} />
          </div>
        }
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  background: #fff;
  padding: ${base * 2}px;
  max-width: 600px;
  margin: 0 auto;

  .back {
    font-size: 0.8em;
    color: #999;
    margin-bottom: ${base * 3}px;
    display: block;
  }

  .account-header {
    display: flex;
    align-items: center;
    word-break: break-all;

    h2 {
      margin-top: 0;
    }
  }

  .meta {
    font-size: 0.9em;
  }

  .name {
    flex: 1;
  }

  .balance {
    flex: 0 0 150px;
    font-weight: bold;
    text-align: center;
  }
`;

const mapStateToProps = (state) => ({
  account: state.accounts.activeAccount,
  loading: state.accounts.loadingAccount,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccount,
    deactivateAccount,
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Account))