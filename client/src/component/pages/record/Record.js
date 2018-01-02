import React, { Component } from "react";
import UserInputItem from "../../form/UserInputItem";
import Button from "../../shared/button/Button";
import axios from "axios";
import firebase from "firebase";

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
      uid: null
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
        alert: this.state.alert,
        happy: this.state.happy,
        energy: this.state.energy,
        calm: this.state.calm
      },
      date: new Date().toISOString()
    };
    console.log(object);
    axios
      .post("http://localhost:3005/user/mood", object)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h1>Record Data</h1>
        <UserInputItem
          updateState={this.updateState}
          name={"stress"}
          title={"How stressed do you feel?"}
          value={this.state.stress}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"tiredness"}
          title={"How tired do you feel?"}
          value={this.state.tiredness}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"active"}
          title={"How active have you been?"}
          value={this.state.active}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"healthy"}
          title={"How healthy do you feel?"}
          value={this.state.healthy}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"alert"}
          title={"How alert do you feel?"}
          value={this.state.alert}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"happy"}
          title={"How happy do you feel?"}
          value={this.state.happy}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"energy"}
          title={"How much energy do you have?"}
          value={this.state.energy}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"calm"}
          title={"How calm do you feel?"}
          value={this.state.calm}
        />
        <Button text={"Submit"} clickEvent={this.clickHandler} />
      </div>
    );
  }
}

export default Record;
