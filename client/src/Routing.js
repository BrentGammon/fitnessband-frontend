import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./component/home/Dashboard";
import Record from "./component/pages/record/Record";
import QueryPage from "./component/pages/queryPage/QueryPage";
import TimeSeries from "./component/pages/timeSeries/TimeSeries";
import Header from "./component/menu/Header";
import Navbar from "./component/menu/Navbar";
import "./routing.scss";
import base from "./base";
import firebase from "firebase";


class Routing extends Component {
  constructor() {
    super();
    this.state = {
      login: false,
      uid: null,
      user: null
    };

    this.authenticate = this.authenticate.bind(this);
    this.signout = this.signout.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { uid } = firebase.auth().currentUser;
        this.setState({ uid });
        this.setState({ login: true });
        base.bindToState(`/users/${uid}`, {
          context: this,
          state: "user"
        });
      } else {
        this.setState({ login: false });
      }
    });
  }

  authenticate() {
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // The signed-in user info.
        const { email, displayName, uid } = result.user;
        const photoURL = result.user.providerData["0"].photoURL;

        base.post(`/users/${uid}`, {
          data: {
            name: displayName,
            email,
            photoURL,
            uid
          },
          then(err) {
            console.log(err);
          }
        });
        this.setState({ login: true });
        this.setState({ uid });

        base.bindToState(`/users/${uid}`, {
          context: this,
          state: "user"
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  signout() {
    firebase
      .auth()
      .signOut()
      .then(
      () => {
        this.setState({ login: false });
        this.setState({ user: null });
        this.setState({ uid: null });
      },
      error => {
        console.error("Sign Out Error", error);
      }
      );
  }

  render() {
    return (
      <Router>
        <div>
          <Header />
          {this.state.login ? (
            <div className="topbar">
              <Navbar />
              <button className="signoutBtn" onClick={() => this.signout()}>
                <i className="fa fa-sign-out" aria-hidden="true" />
                <span className="signoutBtn--text">Sign Out</span>
              </button>
            </div>
          ) : (
              ""
            )}

          <Route
            exact
            path="/"
            render={() => (
              <Home
                login={this.state.login}
                uid={this.state.uid}
                user={this.state.user}
                signout={this.signout}
                authenticate={this.authenticate}
              />
            )}
          />
          <Route
            path="/record"
            render={() => <Record login={this.state.login} />}
          />
          <Route
            path="/queryPage"
            render={() => (
              <QueryPage login={this.state.login} uid={this.state.uid} />
            )}
          />
          <Route
            path="/timeSeries"
            render={() => (
              <TimeSeries login={this.state.login} uid={this.state.uid} />
            )}
          />
        </div>
      </Router>
    );
  }
}

export default Routing;
