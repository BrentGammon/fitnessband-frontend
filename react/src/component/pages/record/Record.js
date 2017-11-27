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
        healthy: this.state.healthy
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
          title={"How stressed do you feel at the moment?"}
          subTitle={"1 = Not stressed at all, 10 = Extremely stressed"}
          value={this.state.stress}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"tiredness"}
          title={"How tired do you feel at the moment?"}
          subTitle={"1 = Not tired at all, 10 = Extremely tired"}
          value={this.state.tiredness}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"active"}
          title={"How active do you think you have been?"}
          subTitle={"1 = Not active at all, 10 = Extremely active"}
          value={this.state.active}
        />
        <UserInputItem
          updateState={this.updateState}
          name={"healthy"}
          title={"How healthy do you feel at the moment?"}
          subTitle={"1 = Not healthy at all, 10 = Extremely healthy"}
          value={this.state.healthy}
        />
        <Button text={"Submit"} clickEvent={this.clickHandler} />
      </div>
    );
  }
}

export default Record;
