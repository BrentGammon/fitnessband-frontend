import React, { Component } from "react";
import firebase from "firebase";
import Header from "../menu/Header";
import "./home.scss";
import "./loginbuttons.scss";
import UserProfile from "../userprofile/UserProfile";
import Summary from "./Summary";
import axios from "axios";

class Dashboard extends Component {
  constructor() {
    super();
    this.renderLogIn = this.renderLogIn.bind(this);
  }

  componentWillMount() {
    console.log(this.props.uid);
    // axios.get(`/api/get/user/summary/${this.props.user.uid}`, (response) => {
    //   console.log(response);
    // }).catch((error) => {
    //   console.log(error);
    // })
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
        {this.props.user ? (
          <div>
            <Summary
              value={25}
              label="Brent is a cunt"
            />
            <UserProfile
              profileImage={this.props.user.photoURL}
              name={this.props.user.name}
              email={this.props.user.email}
            />
          </div>
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default Dashboard;
