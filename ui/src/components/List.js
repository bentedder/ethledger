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
        {!this.props.loadingAccounts && this.props.accounts.map((account, i) => 
          <div key={i} className="item">
            <Link className="info" to={`/${account.address}`}>
              <div>{account.name}</div>
              <div className="meta">{account.address}</div>
            </Link>
            <div className="balance">
              {account.balance}
            </div>
          </div>
        )}
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  background: #fff;

  .item {
    display: flex;
    align-items: center;
  }

  .info {
    padding: ${base * 2}px;
    cursor: pointer;
    flex: 1;

    &:hover {
      background: #efefef;
    }
  }

  .meta {
    font-size: 0.8rem;
    color: #888;
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