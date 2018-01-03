import React, { Component } from "react";
import firebase from "firebase";
import Header from "../menu/Header";
import "./home.scss";
import "./loginbuttons.scss";

class Home extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);
  }
  renderLogIn() {
    return (
      <button
        className="loginBtn loginBtn--facebook"
        onClick={() => this.props.authenticate()}
      >
        facebook login
      </button>
    );
  }

  render() {
    return (
      <div className="App">
        {!this.props.login ? this.renderLogIn() : ""}

        <br />
        <br />

        {this.props.user ? <img src={this.props.user.photoURL} alt="" /> : ""}
        {this.props.user ? <h1>{this.props.user.name}</h1> : ""}
        {this.props.user ? <h1>{this.props.user.email}</h1> : ""}
      </div>
    );
  }
}

export default Home;
