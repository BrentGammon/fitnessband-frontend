import React, { Component } from "react";

class UserInputItem extends Component {
  constructor() {
    super();

    this.updateValue = this.updateValue.bind(this);
  }
  updateValue(event) {
    //this.setState({ value: event.target.value });
    this.props.updateState(this.props.name, event.target.value);
  }
  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>
        <input
          onChange={this.updateValue}
          type="range"
          name="grade"
          min="1"
          max="10"
        />
        {this.props.value}
      </div>
    );
  }
}

export default UserInputItem;
