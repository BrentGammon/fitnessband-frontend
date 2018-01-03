import React, { Component } from "react";
import UserInputItem from "../../form/UserInputItem";
import Button from "../../shared/button/Button";
import axios from "axios";
import firebase from "firebase";
import "./record.scss";
import mapkeys from "lodash.mapkeys";
class Record extends Component {
  constructor() {
    super();
    this.state = {
      stress: null,
      tiredness: null,
      active: null,
      healthy: null,
      alertness: null,
      happy: null,
      energy: null,
      calm: null,
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
    console.log("qwertyuiop");
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
        healthy: this.state.healthy,
        alert: this.state.alertness,
        happy: this.state.happy,
        energy: this.state.energy,
        calm: this.state.calm
      },
      date: new Date().toISOString()
    };
    const keyValues = Object.values(object).includes(null);
    console.log(keyValues);
    if (keyValues !== false) {
      axios
        .post("http://localhost:3005/user/mood", object)
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      const errorObject = Object.keys(object.user)
        .map(item => {
          console.log(object.user[item]);
          console.log(item);
          if (object.user[item] === null) {
            return item;
          }
        })
        .filter(item => {
          if (item !== "uid") {
            return item;
          }
        });
      this.setState({ error: errorObject });
      console.log(errorObject);
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
        <UserInputItem
          updateState={this.updateState}
          name={"alertness"}
          title={"How alert do you feel?"}
          value={this.state.alertness}
          error={this.state.error.includes("alert")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"happy"}
          title={"How happy do you feel?"}
          value={this.state.happy}
          error={this.state.error.includes("happy")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"energy"}
          title={"How much energy do you have?"}
          value={this.state.energy}
          error={this.state.error.includes("energy")}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"calm"}
          title={"How calm do you feel?"}
          value={this.state.calm}
          error={this.state.error.includes("calm")}
        />
        <Button text={"Submit"} clickEvent={this.clickHandler} />
        {this.state.error.length > 0 ? (
          <h1>The questions marked in red are mandatory</h1>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Record;
