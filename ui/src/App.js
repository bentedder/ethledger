import './App.css';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Account from './components/Account';
import Home from './components/Home';

const App = (props) => (
  <Provider store={props.store}>
    <Router>
      <div>
        <h1>Eth Ledger</h1>
        <Route exact path="/" component={Home} />
        <Route path="/:address" component={Account} />
      </div>
    </Router>
  </Provider>
);

export default App;
