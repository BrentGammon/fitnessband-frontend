import React, { Component } from "react";
import Button from "../../shared/button/Button";
import axios from "axios";

class QueryPage extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      timePeriod: "",
      startTime: "",
      endTime: "",
      comparision: "",
      mood: "",
      result: null,
      error: null
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.resultTag = this.resultTag.bind(this);
  }

  clickHandler(sd, ed, c, m) {
    if (sd !== ed) {
      let object = {
        user: {
          uid: this.props.uid,
          mood: m,
          startTime: sd,
          endTime: ed,
          comparision: c
        }
      };
      axios
        .post("http://localhost:3005/fitness/queryPage", object)
        .then(response => {
          console.log(response.data);
          this.setState({ error: null });
          this.setState({ result: response.data });
        })
        .catch(error => {
          console.log("hello world");
          console.log(error.response.data.message);
          this.setState({ result: null });
          this.setState({ error: error.response.data.message });
        });
    } else {
      this.setState({ error: "Time peroid can't be the same" });
    }
  }

  clicked() {
    this.clickHandler(
      this.refs.time1.value,
      this.refs.time2.value,
      this.refs.comparision.value,
      this.refs.mood1.value
    );
  }

  resultTag() {
    if (this.state.result !== null) {
      return <p>Result:{this.state.result}</p>;
    }
  }

  render() {
    //conditional rendering
    return (
      <div>
        <p>I feel</p>

        <select ref="comparision">
          <option value="More">More</option>
          <option value="Less">Less</option>
        </select>

        <select ref="mood1">
          <option value="stress">stress</option>
          <option value="tiredness">tiredness</option>
          <option value="active">active</option>
          <option value="healthy">healthy</option>
          <option value="alertness">alertness</option>
          <option value="happiness">happiness</option>
          <option value="energy">energy</option>
          <option value="calmness">calmness</option>
        </select>

        <select ref="time1">
          <option value="Today">Today</option>
          <option value="Last Week">Last Week</option>
          <option value="This Week">This Week</option>
        </select>

        <p>compared to</p>

        <select ref="time2">
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
        {this.state.result !== null ? (
          this.state.result ? (
            <p>Result: True</p>
          ) : (
            <p>Result: False</p>
          )
        ) : (
          ""
        )}

        {this.state.error ? <p>{this.state.error}</p> : ""}
      </div>
    );
  }
}

export default QueryPage;
