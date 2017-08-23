import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.scss';
import Home from './component/home/Home';

class Routing extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <Home/>}/>
          <Route path="/hello" render={() => <h1>Hello World</h1>}/>
        </div>
      </Router>
    );
  }
}

export default Routing;
