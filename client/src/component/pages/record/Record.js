import React, { Component } from "react";
import UserInputItem from "../../form/UserInputItem";
import Button from "../../shared/button/Button";
import axios from "axios";
import firebase from "firebase";
import "./record.scss";
import { Redirect } from "react-router";
class Record extends Component {
  constructor() {
    super();
    this.state = {
      stress: null,
      tiredness: null,
      active: null,
      healthy: null,
      uid: null,
      error: []
    };
    this.updateState = this.updateState.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  componentWillMount() {
    //this.setState({uid : })

    if (firebase.auth().currentUser) {
      this.setState({ uid: firebase.auth().currentUser.uid });
    }
  }

  updateState(key, value) {
    this.setState({ [key]: value });
  }

  clickHandler() {
    let object = {
      user: {
        uid: this.state.uid,
        stress: this.state.stress,
        tiredness: this.state.tiredness,
        active: this.state.active,
        healthy: this.state.healthy
      },
      date: new Date().toISOString()
    };
    const keyValues = Object.values(object.user).includes(null);
    if (!keyValues) {
      this.setState({ error: [] });
      axios
        .post("/api/post/user/mood", object)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      const errorObject = Object.keys(object.user)
        .map(function (item) {
          let data;
          if (object.user[item] === null) {
            data = item;
          }
          return data;
        })
        .filter(function (item) {
          let data;
          if (item !== "uid") {
            data = item;
          }
          return data;
        });
      this.setState({ error: errorObject });
    }
  }

  render() {
    return (
      <div className="recordform">
        <h1>Record Data</h1>
        <UserInputItem
          updateState={this.updateState}
          name={"stress"}
          title={"How stressed do you feel?"}
          value={this.state.stress}
          error={this.state.error.includes("stress")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"tiredness"}
          title={"How tired do you feel?"}
          value={this.state.tiredness}
          error={this.state.error.includes("tiredness")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"active"}
          title={"How active have you been?"}
          value={this.state.active}
          error={this.state.error.includes("active")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"healthy"}
          title={"How healthy do you feel?"}
          value={this.state.healthy}
          error={this.state.error.includes("healthy")}
        />
        <Button text={"Submit"} clickEvent={this.clickHandler} />
        {this.state.error.length > 0 ? (
          <h1>The questions marked in red are mandatory</h1>
        ) : (
            ""
          )}
        {!this.props.login ? <Redirect to="/" /> : ""}
      </div>
    );
  }
}

export default Record;
