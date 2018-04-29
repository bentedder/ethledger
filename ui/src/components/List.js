import React, { Component } from 'react';
import styled from 'styled-components';
import { base } from '../common';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getAccounts, createAccount } from '../state/actions';

class List extends Component {

  componentDidMount() {
    this.props.getAccounts();
  }

  render() {
    return (
      <Wrap>
        {this.props.loadingAccounts &&
          <div>Loading accounts</div>
        }
        {!this.props.loadingAccounts && this.props.accounts.length === 0 &&
          <div>You have not added any Ethereum addresses yet. Add an Ethereum address using the form above, and give it a memorable nickname so you can recognize it later.</div>
        }
        {!this.props.loadingAccounts && this.props.accounts.map((account, i) => 
          <div key={i} className="item">
            <Link className="info" to={`/${account.address}`}>
              <div>{account.name}</div>
              <div className="meta">{account.address}</div>
            </Link>
            <div className="balance">
              {parseFloat(account.balance).toFixed(4)}
            </div>
          </div>
        )}
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  background: #fff;
  padding: ${base * 2}px;
  max-width: 600px;
  margin: 0 auto;

  .item {
    display: flex;
    align-items: stretch;
    word-break: break-all;
    margin: ${base * 3}px 0;
  }

  .info {
    padding: ${base * 2}px;
    cursor: pointer;
    flex: 1;
    text-decoration: none;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 3px;

    &:hover {
      cursor: pointer;
      box-shadow: 1px 1px 7px -1px #aaa;
      z-index: 20;
    }
  }

  .meta {
    font-size: 0.7rem;
    color: #888;
  }

  .balance {
    flex: 0 0 100px;
    padding: 20px;
    word-break: normal;
    text-align: right;
    font-size: 0.9em;
    font-weight: bold;
    background: #efefef;
    border: 1px solid #ccc;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-left: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const mapStateToProps = (state) => ({
  accounts: state.accounts.accounts,
  loadingAccounts: state.accounts.loadingAccounts,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getAccounts,
    createAccount
  }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(List);