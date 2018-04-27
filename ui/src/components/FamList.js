import React, { Component } from 'react';
import styled from 'styled-components';
import { base } from '../common';

class FamList extends Component {

  render() {
    return (
      <Wrap>
        {this.props.addresses.map((address, i) => 
          <div key={i} className="address-item">
            <div className="info" onClick={this.props.onActivate.bind(null, address.address)}>
              <div>{address.name}</div>
              <div className="meta">{address.address}</div>
            </div>
            <div className="actions">
              <button className="delete-btn" type="button" onClick={this.props.onDelete.bind(null, address.address, i)}>&times;</button>
            </div>
          </div>
        )}
      </Wrap>
    );
  }
}

const Wrap = styled.div`
  background: #fff;

  .address-item {
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

  .actions {
    padding: ${base * 2}px;
  }

  .delete-btn {
    outline: 0;
    border: 0;
    background: none;
    color: #909090;
    cursor: pointer;
    font-size: 1.3rem;

    &:hover {
      color: #b80e17;
    }
  }
`;

export default FamList;
