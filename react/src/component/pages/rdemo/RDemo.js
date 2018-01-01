import React, { Component } from "react";
import axios from "axios";
import loadImage from "blueimp-load-image";
import fs from "fs";

class RDemo extends Component {
  constructor() {
    super();
    let image = null;
    this.displayImage = this.displayImage.bind(this);
  }

  componentWillMount() {
    console.log("hello");
    axios
      .get("http://localhost:3005/demochart")
      .then(response => {
        this.image = response.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  displayImage() {
    return this.image;
  }

  render() {
    return (
      <div>
        <p>Hello world</p>
        {this.image ? (
          <img src={`data:image/png;base64, ${this.image}`} />
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
