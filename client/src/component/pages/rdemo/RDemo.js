import React, { Component } from "react";
import axios from "axios";
import loadImage from "blueimp-load-image";
import { Redirect } from "react-router";
import fs from "fs";

class RDemo extends Component {
  constructor() {
    super();
    this.state = {
      image: null
    };

    this.displayImage = this.displayImage.bind(this);
  }

  componentDidMount() {
    console.log("hello");
    axios
      .get("/api/get/demochart")
      .then(response => {
        this.setState({ image: response.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  displayImage() {
    return this.state.image;
  }

  render() {
    return (
      <div>
        {!this.props.login ? <Redirect to="/" /> : ""}
        <p>Hello world</p>
        {this.state.image ? (
          <img src={`data:image/png;base64, ${this.state.image}`} />
        ) : (
            console.log("null")
          )}
      </div>
    );
  }
}

{
  /* <img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUA
AAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO
    9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot" /> */
}

export default RDemo;
