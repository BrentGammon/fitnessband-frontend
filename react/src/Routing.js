import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import Home from "./component/home/Home";
import Record from "./component/pages/record/Record";

class Routing extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={() => <Home />} />
          <Route path="/hello" render={() => <h1>Hello World</h1>} />
          <Route path="/record" render={() => <Record />} />
        </div>
      </Router>
    );
  }
}

export default Routing;
