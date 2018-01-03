import React, { Component } from "react";
import "./userinputitem.scss";

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
      <div
        className={this.props.error ? "userinputitem__error" : "userinputitem"}
      >
        <h2>{this.props.title}</h2>
        <p>{this.props.subTitle}</p>
        <input
          onChange={this.updateValue}
          type="range"
          name="grade"
          min="1"
          max="10"
        />
        <div>{this.props.value}</div>
      </div>
    );
  }
}

export default UserInputItem;
