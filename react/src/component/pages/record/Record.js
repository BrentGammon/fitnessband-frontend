import React, { Component } from "react";
import UserInputItem from "../../form/UserInputItem";
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
  }

  updateState(object) {
    this.setState({ object });
  }

  render() {
    return (
      <div>
        <h1>Record Data</h1>
        <UserInputItem
          updateState={this.updateState}
          title={"How stressed do you feel?"}
          value={this.state.stress}
        />
        <UserInputItem
          updateState={this.updateState}
          title={"How tired do you feel?"}
          value={this.state.tiredness}
        />
        <UserInputItem
          updateState={this.updateState}
          title={"How active have you been?"}
          value={this.state.active}
        />
        <UserInputItem
          updateState={this.updateState}
          title={"How healthy do you feel?"}
          value={this.state.healthy}
        />
      </div>
    );
  }
}

export default Record;
