import React, { Component } from 'react';
import styled from 'styled-components';

import List from './List';
import NewAccount from './NewAccount';

class Home extends Component {

  render() {
    return (
      <Wrap>
        <NewAccount />
        <List />
      </Wrap>
    );
  }
}
const Wrap = styled.div`
`;

export default Home;