import React, { Component } from "react";
import Button from "../../shared/button/Button";
import axios from "axios";

class QueryPage extends Component {
  constructor() {
    super();
    this.state = {
      text: "Stressed",
      timePeriod: "Today"
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    console.log("querfront");
    let object = {
      user: {
        uid: this.props.uid,
        timePeriod: this.state.timePeriod,
        mood: this.state.text
      }
    };
    console.log(object);
    axios
      .post("http://localhost:3005/fitness/queryPage", object)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  clicked() {
    this.setState({ text: this.refs.textBox.value });
    this.setState({ timePeriod: this.refs.time.value });
    this.clickHandler();
  }

  render() {
    return (
      <div>
        {/*{this.props.uid}
        {this.state.timePeriod}
        {this.state.text}*/}
        <p>I feel more</p>

        <select ref="textBox">
          <option value="stress">stress</option>
          <option value="tiredness">tiredness</option>
          <option value="active">active</option>
          <option value="healthy">healthy</option>
          <option value="alertness">alertness</option>
          <option value="happiness">happiness</option>
          <option value="energy">energy</option>
          <option value="calmness">calmness</option>
        </select>

        <p>compared to</p>

        <select ref="time">
          <option value="Today">Today</option>
          <option value="Last Week">Last Week</option>
          <option value="This Week">This Week</option>
        </select>

        <button
          onClick={e => {
            this.clicked();
          }}
        >
          Mood
        </button>
      </div>
    );
  }
}

export default QueryPage;
