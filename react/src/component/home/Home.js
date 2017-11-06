import React, { Component } from "react";
import logo from "../../logo.svg";
import firebase from "firebase";
import { NavLink } from "react-router-dom";
class Home extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);
  }
  renderLogIn() {
    return (
      <button onClick={() => this.props.authenticate()}>facebook login</button>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React new version</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {/*{console.log(this.state.login)}*/}
        {!this.props.login ? this.renderLogIn() : ""}

        <button onClick={() => this.props.syncData()}>firebase put data</button>
        <button onClick={() => this.props.signout()}>sign out</button>
        <button onClick={() => console.log(firebase.auth().currentUser)}>
          User Signed in
        </button>
        <NavLink to="/record">Record</NavLink>
        <NavLink to="/queryPage">QueryPage</NavLink>
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
