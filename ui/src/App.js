import './App.css';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import styled from 'styled-components';

import Account from './components/Account';
import Home from './components/Home';

const App = (props) => (
  <Provider store={props.store}>
    <Router>
      <div>
        <AppHeader>
          <Link to={'/'}><h1>Eth Ledger</h1></Link>
        </AppHeader>
        <Route exact path="/" component={Home} />
        <Route path="/:address" component={Account} />
      </div>
    </Router>
  </Provider>
);

const AppHeader = styled.div`
  border-bottom: 1px solid #ccc;
  background: white url(${require('./heath-ledger.jpg')}) no-repeat left center;
  background-size: contain;
  height: 120px;
  display: flex;
  align-items: center;
  a {
    text-decoration: none;
  }
  h1 {
    margin: 0 0 0 150px;
    font-weight: normal;
    color: #005baa;
    font-family: 'Josefin Sans', sans-serif;
    font-size: 40px;
  }
`;

export default App;
