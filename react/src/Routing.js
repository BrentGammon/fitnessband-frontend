import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.scss";
import Home from "./component/home/Home";
import Record from "./component/pages/record/Record";
import QueryPage from "./component/pages/queryPage/QueryPage";

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
    this.syncData = this.syncData.bind(this);
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
        console.log(false);
        this.setState({ login: false });
      }
    });
  }

  authenticate() {
    let provider = new firebase.auth.FacebookAuthProvider();
    const result = firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const token = result.credential.accessToken;
        // The signed-in user info.
        const { email, displayName, uid, photoURL } = result.user;

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
        console.log(this.ref);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  syncData() {
    const email = this.state.email;
    const displayName = this.state.displayName;
    const uid = this.state.uid;
    base.post(`/users/${uid}/nested`, {
      data: {
        test: "thing"
      },
      then(err) {
        console.log(err);
      }
    });
  }

  signout() {
    // base.remove(`/users/${this.state.uid}`, (err) =>{
    //     if(err){
    //         console.log("removing data");
    //     }
    // });
    firebase
      .auth()
      .signOut()
      .then(
        () => {
          console.log("Signed Out");
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
          <Route
            exact
            path="/"
            render={() => (
              <Home
                login={this.state.login}
                uid={this.state.uid}
                user={this.state.user}
                syncData={this.syncData}
                signout={this.signout}
                authenticate={this.authenticate}
              />
            )}
          />
          <Route path="/record" render={() => <Record />} />
          <Route path="/queryPage" render={() => <QueryPage uid={this.state.uid} />}/>
        </div>
      </Router>
    );
  }
}

export default Routing;
