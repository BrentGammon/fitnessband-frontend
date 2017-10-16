import React, { Component } from "react";
import UserInputItem from "../../form/UserInputItem";
import Button from "../../shared/button/Button";
import axios from "axios";
class Record extends Component {
  constructor() {
    super();
    this.state = {
      stress: null,
      tiredness: null,
      active: null,
      healthy: null
    };
    this.updateState = this.updateState.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
  }

  updateState(key, value) {
    this.setState({ [key]: value });
  }

  clickHandler() {
    let object = {
      stress: this.state.stress,
      tiredness: this.state.tiredness,
      active: this.state.active,
      healthy: this.state.healthy
    };
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
        <Button text={"Submit"} clickEvent={this.clickHandler} />
      </div>
    );
  }
}

export default Record;
