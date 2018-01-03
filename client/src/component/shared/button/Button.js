import React, { Component } from "react";
import "./button.scss";
class Button extends Component {
  constructor() {
    super();

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.clickEvent();
  }

  render() {
    return (
      <button className="btn" onClick={this.clickHandler}>
        {this.props.text}
      </button>
    );
  }
}

export default Button;
