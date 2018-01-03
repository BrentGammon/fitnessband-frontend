import React, { Component } from "react";

import firebase from "firebase";
import { NavLink } from "react-router-dom";
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
        <Header />
        {!this.props.login ? this.renderLogIn() : ""}

        {/* <button onClick={() => this.props.syncData()}>firebase put data</button> */}
        {this.props.login ? (
          <button className="signoutBtn" onClick={() => this.props.signout()}>
            <i className="fa fa-sign-out" aria-hidden="true" />
            <span className="signoutBtn--text">Sign Out</span>
          </button>
        ) : (
          ""
        )}

        {/* <button onClick={() => console.log(firebase.auth().currentUser)}>
          User Signed in
        </button> */}
        {this.props.login ? (
          <div>
            <NavLink to="/record">Record</NavLink>
            <NavLink to="/queryPage">QueryPage</NavLink>
          </div>
        ) : (
          ""
        )}

        <br />
        <br />

        {this.props.user ? <img src={this.props.user.photoURL} alt="" /> : ""}
        {this.props.user ? <h1>{this.props.user.name}</h1> : ""}
        {this.props.user ? <h1>{this.props.user.email}</h1> : ""}
        {this.props.user ? <h1>{this.props.user.uid}</h1> : ""}
      </div>
    );
  }
}

export default Home;
